import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import AuthContext from "../AuthContext";
import AxiosInstance from "../AxiosInstance";

function useFetchAccountData(setScores) {
  const { auth, setAuth } = useContext(AuthContext);
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
}

export default useFetchAccountData;
