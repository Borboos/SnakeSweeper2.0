import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import AcctScoreList from "./AcctScoreList";
import AxiosInstance from "../AxiosInstance";
import AuthContext from "../AuthContext";

function Account() {
  const [scores, setScores] = useState();
  const [newUsername, setNewUsername] = useState("");
  const [usernameUpdate, setUsernameUpdate] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const { setAuth, auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await AxiosInstance.get("/account", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setScores(response.data.scores);
      } catch (error) {
        if (error.response.status === 403) {
          try {
            const response2 = await AxiosInstance.get("/refresh");
            setAuth(response2.data);
            try {
              const response3 = await AxiosInstance.get("/account", {
                headers: {
                  Authorization: `Bearer ${response2.data.token}`,
                },
              });
              setScores(response3.data.scores);
            } catch (error) {
              console.log(error);
              setAuth({});
              navigate("/login", { state: { from: location }, replace: true });
            }
          } catch (error) {
            console.log(error);
            setAuth({});
            navigate("/login", { state: { from: location }, replace: true });
          }
        } else navigate("/login", { state: { from: location }, replace: true });
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await AxiosInstance.post(
        "/account",
        { username: newUsername },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setAuth(response.data);
      setNewUsername("");
      setUsernameUpdate(false);
    } catch (error) {
      if (error.response.status === 403) {
        try {
          const response2 = await AxiosInstance.get("/refresh");
          setAuth(response2.data);
          try {
            const response3 = await AxiosInstance.post(
              "/account",
              { username: newUsername },
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );
            setAuth(response3.data);
            setNewUsername("");
            setUsernameUpdate(false);
          } catch (error) {
            if (error.response.status === 409) {
              setUsernameTaken(true);
            }
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      } else if (error.response.status === 409) {
        setUsernameTaken(true);
      }
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Account Information:</h1>
      <p>Email: {auth.email}</p>
      <p>Username: {auth.username}</p>
      {!usernameUpdate ? (
        <button onClick={() => setUsernameUpdate(true)}>Change Username</button>
      ) : (
        <div>
          <form onSubmit={(event) => handleSubmit(event)}>
            <input
              onChange={(event) => setNewUsername(event.target.value)}
              name="newUsername"
              placeholder="Enter new username"
            />
            <button type="submit">Submit</button>
          </form>
          {usernameTaken && <p>Username taken</p>}
        </div>
      )}
      {scores ? (
        <div>
          <AcctScoreList game="Snake" scores={scores.snakeScores} />
          <AcctScoreList game="Minesweeper" scores={scores.minesweeperScores} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Account;
