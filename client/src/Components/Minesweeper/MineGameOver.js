import React from "react";
import usePostScoreData from "../../Hooks/usePostScoreData";

function MineGameOver({ gameWon, finalTime, getTime, resetGame }) {
  usePostScoreData("/minesweeper", finalTime, gameWon);
  return (
    <div className="GameOver">
      {gameWon ? (
        <div>
          <h1>Congratulations, you won!</h1>
          <h1>Time Played: {getTime(finalTime)}</h1>
          <button className="formButton" onClick={() => resetGame()}>
            Click Here to Restart
          </button>
        </div>
      ) : (
        <div>
          <h1>You detonated a bomb!</h1>
          <h1>Time Played: {getTime(finalTime)}</h1>
          <button className="formButton" onClick={() => resetGame()}>
            Click Here to Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default MineGameOver;
