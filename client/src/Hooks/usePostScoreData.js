import { useContext, useEffect } from "react";
import AuthContext from "../AuthContext";
import AxiosInstance from "../AxiosInstance";

function usePostScoreData(endpoint, score, gameWon) {
  const { auth, setAuth } = useContext(AuthContext);
  const date = new Date().toLocaleDateString("en-US");
  useEffect(() => {
    async function postData() {
      if (auth.token && gameWon) {
        try {
          await AxiosInstance.post(
            endpoint,
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
                  endpoint,
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
    }
    postData();
  }, []);
}

export default usePostScoreData;
