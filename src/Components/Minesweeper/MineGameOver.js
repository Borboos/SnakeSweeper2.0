import React, { useContext, useEffect } from "react";
import AuthContext from "../../AuthContext";
import AxiosInstance from "../../AxiosInstance";

function MineGameOver({ gameWon, resetGame, finalTime, getTime }) {
  const { auth, setAuth } = useContext(AuthContext);
  const date = new Date().toLocaleDateString("en-US");

  useEffect(() => {
    if (auth.token && gameWon) {
      async function postData() {
        try {
          await AxiosInstance.post(
            "/minesweeper",
            { score: finalTime, date },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );
        } catch (error) {
          if (error.response.status === 403) {
            try {
              const response = await AxiosInstance.get("/refresh");
              setAuth(response.data);
              try {
                await AxiosInstance.post(
                  "/minesweeper",
                  { score: finalTime, date },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${auth.token}`,
                    },
                  }
                );
              } catch (error) {
                console.log(error);
              }
            } catch (error) {
              console.log(error);
            }
          }
          console.log(error);
        }
      }
      postData();
    }
  }, []);

  return (
    <div className="GameOver">
      {gameWon ? (
        <div>
          <h1>Congratulations, you won!</h1>
          <h1>Time Played: {getTime(finalTime)}</h1>
          <button onClick={() => resetGame()}>Click Here to Restart</button>
        </div>
      ) : (
        <div>
          <h1>You detonated a bomb!</h1>
          <h1>Time Played: {getTime(finalTime)}</h1>
          <button onClick={() => resetGame()}>Click Here to Restart</button>
        </div>
      )}
    </div>
  );
}

export default MineGameOver;
