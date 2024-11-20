import React from "react";

function ScoreList({ game, scores }) {
  function getTimeString(timeInSec) {
    const minutes = Math.floor(timeInSec / 60);
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = timeInSec % 60;
    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutesStr}:${secondsStr}`;
  }

  return (
    <div>
      <h1>{game} High Scores</h1>
      <table>
        <tbody>
          <tr>
            {game === "Snake" ? <th>Score</th> : <th>Completion Time</th>}
            <th>Date</th>
          </tr>
          {scores.map((score, index) => (
            <tr key={index}>
              {game === "Snake" ? (
                <th>{score.score}</th>
              ) : (
                <th>{getTimeString(score.score)}</th>
              )}
              <th>{score.date}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScoreList;
