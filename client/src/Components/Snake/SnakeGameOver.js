import React, { useContext, useEffect } from "react";
import AuthContext from "../../AuthContext";
import AxiosInstance from "../../AxiosInstance";

function SnakeGameOver({ score, resetGame }) {
  const { auth, setAuth } = useContext(AuthContext);
  const date = new Date().toLocaleDateString("en-US");

  useEffect(() => {
    if (auth.token) {
      async function postData() {
        try {
          await AxiosInstance.post(
            "/snake",
            { score, date },
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
                  "/snake",
                  { score, date },
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
    <div className="gameOver">
      <h1>Game Over</h1>
      <h1>Fruits Eaten: {score}</h1>
      <button onClick={() => resetGame()}>Click Here to Restart</button>
    </div>
  );
}

export default SnakeGameOver;
