import React from "react";

function LeadScoreList({ game, scores }) {
  function getTimeString(timeInSec) {
    const minutes = Math.floor(timeInSec / 60);
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = timeInSec % 60;
    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutesStr}:${secondsStr}`;
  }

  return (
    <div>
      <h2>{game} High Scores</h2>
      <table>
        <tbody>
          <tr>
            <th>User</th>
            {game === "Snake" ? <th>Score</th> : <th>Completion Time</th>}
            <th>Date</th>
          </tr>
          {scores.map((score, index) => (
            <tr key={index}>
              <th>{score.username}</th>
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

export default LeadScoreList;
