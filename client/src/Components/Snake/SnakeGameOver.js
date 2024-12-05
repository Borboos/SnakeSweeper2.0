import React from "react";
import usePostScoreData from "../../Hooks/usePostScoreData";

function SnakeGameOver({ score, resetGame }) {
  usePostScoreData("/snake", score, true);
  return (
    <div className="gameOver">
      <h1>Game Over</h1>
      <h1>Fruits Eaten: {score}</h1>
      <button className="formButton" onClick={() => resetGame()}>
        Click Here to Restart
      </button>
    </div>
  );
}

export default SnakeGameOver;
