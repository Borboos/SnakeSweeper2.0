import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";

env.config({
  path: "../.env",
});
const app = express();
const PORT = process.env.PORT || 5000;
const buildPath = path.join(process.cwd(), "../client/build");
const devDBConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};
const prodDBConfig = { connectionString: process.env.DATABASE_URL };

const db = new pg.Client(
  process.env.NODE_ENV === "production" ? prodDBConfig : devDBConfig
);
db.connect();

function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided in header" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid access token" });
    }
    req.user = decoded;
    next();
  });
}

function corsSetup(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
}

if (process.env.NODE_ENV === "production") app.use(express.static(buildPath));
app.use(corsSetup);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/leaderboard", async (req, res) => {
  const snakeScoreQ = await db.query(
    `SELECT users.username, snakescores.score, snakescores.date
    FROM snakescores 
    INNER JOIN users ON snakescores.email=users.email
    ORDER BY snakescores.score DESC
    LIMIT 15;`
  );
  const mineScoreQ = await db.query(
    `SELECT users.username, minesweeperscores.score, minesweeperscores.date
    FROM minesweeperscores
    INNER JOIN users ON minesweeperscores.email=users.email
    ORDER BY minesweeperscores.score ASC
    LIMIT 15;`
  );
  const scoreData = {
    snakeScores: snakeScoreQ.rows,
    minesweeperScores: mineScoreQ.rows,
  };
  return res.status(200).json(scoreData);
});

app.post("/register", async (req, res) => {
  if (!req.body.email || !req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ error: "Email, username, and password are required" });
  }
  const checkEmail = await db.query(
    `SELECT * FROM users WHERE email = '${req.body.email}';`
  );
  if (checkEmail.rows.length > 0) {
    return res.status(409).json({ error: "Email already taken" });
  }
  const checkUsername = await db.query(
    `SELECT * FROM users WHERE username = '${req.body.username}';`
  );
  if (checkUsername.rows.length > 0) {
    return res.status(409).json({ error: "Username already taken" });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await db.query(
    `INSERT INTO users (email, username, password)
     VALUES('${req.body.email}', '${req.body.username}', '${hashedPassword}')`
  );
  return res.status(200).json({ message: "User added" });
});

app.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ error: "Email and password fields are required" });
  }
  const userQ = await db.query(
    `SELECT * FROM users WHERE email= '${req.body.email}';`
  );
  if (userQ.rows.length === 0) {
    return res.status(400).json({ error: "No account with provided email" });
  }
  const user = userQ.rows[0];
  const passwordsMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordsMatch) {
    return res.status(400).json({
      error: "Incorrect password",
    });
  }
  const accessToken = jwt.sign(
    { email: user.email, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "900s",
    }
  );
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );
  await db.query(
    `UPDATE users
    SET refresh_token = '${refreshToken}'
    WHERE email = '${user.email}';`
  );
  return res
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    })
    .json({ token: accessToken, email: user.email, username: user.username });
});

app.get("/refresh", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(400).json({ error: "Refresh cookie empty" });
  }
  const refreshToken = cookies.jwt;
  const userQ = await db.query(
    `SELECT * FROM users WHERE refresh_token = '${refreshToken}'`
  );
  if (userQ.rows.length === 0) {
    return res.status(400).json({ error: "No user refresh token match" });
  }
  const user = userQ.rows[0];
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Refresh token expired" });
    const accessToken = jwt.sign(
      { email: user.email, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "900s",
      }
    );
    return res
      .status(200)
      .json({ token: accessToken, email: user.email, username: user.username });
  });
});

app.get("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(204).json({ message: "Refresh cookie already empty" });
  }
  const refreshToken = cookies.jwt;
  const userQ = await db.query(
    `SELECT * FROM users WHERE refresh_token = '${refreshToken}'`
  );
  if (userQ.rows.length === 0) {
    return res
      .status(204)
      .clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
      .json({ message: "No user refresh token match, cookie cleared" });
  }
  await db.query(
    `UPDATE users 
    SET refresh_token = NULL
    WHERE refresh_token = '${refreshToken}';`
  );
  return res
    .status(204)
    .clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
    .json({ message: "User token cleared, cookie cleared" });
});

app.get("/account", verifyAccessToken, async (req, res) => {
  const user = req.user;
  const minesweeperScoresQ = await db.query(
    `SELECT score, date
    FROM minesweeperscores
    INNER JOIN users ON minesweeperscores.email=users.email
    WHERE users.email = '${user.email}'
    ORDER BY score ASC
    LIMIT 15;`
  );
  const snakeScoresQ = await db.query(
    `SELECT score, date
    FROM snakescores 
    INNER JOIN users ON snakescores.email=users.email 
    WHERE users.email = '${user.email}'
    ORDER BY score DESC
    LIMIT 15;`
  );
  const minesweeperScores =
    minesweeperScoresQ.rows.length > 0
      ? minesweeperScoresQ.rows.map((e) => e)
      : [];
  const snakeScores =
    snakeScoresQ.rows.length > 0 ? snakeScoresQ.rows.map((e) => e) : [];
  let scores = { minesweeperScores, snakeScores };
  return res
    .status(200)
    .json({ email: user.email, username: user.username, scores });
});

app.post("/account", verifyAccessToken, async (req, res) => {
  const user = req.user;
  const alreadyExistsQ = await db.query(
    `SELECT * FROM users WHERE username='${req.body.username}'`
  );
  if (!req.body.username) {
    return res.status(400).json({ error: "Username field is required" });
  }
  if (alreadyExistsQ.rows.length > 0) {
    return res.status(409).json({ error: "Username already taken" });
  }
  await db.query(
    `UPDATE users 
    SET username='${req.body.username}' 
    WHERE email='${user.email}'`
  );
  const accessToken = jwt.sign(
    { email: user.email, username: req.body.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "900s",
    }
  );
  return res.status(200).json({
    token: accessToken,
    email: user.email,
    username: req.body.username,
  });
});

app.post("/snake", verifyAccessToken, async (req, res) => {
  const user = req.user;
  if (!req.body.score || !req.body.date) {
    return res
      .status(400)
      .json({ error: "Score and date fields are required" });
  }
  await db.query(
    `INSERT INTO snakescores (email, score, date)
    VALUES('${user.email}', ${req.body.score}, '${req.body.date}')`
  );
  return res.status(200).json({ message: "Score added" });
});

app.post("/minesweeper", verifyAccessToken, async (req, res) => {
  const user = req.user;
  if (!req.body.score || !req.body.date) {
    return res
      .status(400)
      .json({ error: "Score and date fields are required" });
  }
  await db.query(
    `INSERT INTO minesweeperscores (email, score, date)
    VALUES('${user.email}', ${req.body.score}, '${req.body.date}')`
  );
  return res.status(200).json({ message: "Score added" });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
