import React, { useState, useEffect } from "react";
import LeadScoreList from "./LeadScoreList";
import AxiosInstance from "../AxiosInstance";

function Leaderboard() {
  const [scores, setScores] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await AxiosInstance.get("/leaderboard");
        setScores(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      <h1>User Leaderboard</h1>
      {scores ? (
        <div>
          <LeadScoreList game="Snake" scores={scores.snakeScores} />
          <LeadScoreList game="Minesweeper" scores={scores.minesweeperScores} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Leaderboard;
