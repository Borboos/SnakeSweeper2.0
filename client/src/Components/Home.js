import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Snakesweeper</h1>
      <div>
        <h2>Snake</h2>
        <Link to="snake">
          <img src="./images/snake.png" />
        </Link>
      </div>
      <div>
        <h2>Minesweeper</h2>
        <Link to="minesweeper">
          <img src="./images/minesweeper.png"></img>
        </Link>
      </div>
    </div>
  );
}

export default Home;
