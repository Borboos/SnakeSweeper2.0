import AxiosInstance from "./AxiosInstance";

async function changeUsername(
  auth,
  setAuth,
  newUsername,
  setNewUsername,
  setUsernameUpdate,
  setUsernameTaken
) {
  try {
    const response = await AxiosInstance.post(
      "/account",
      { username: newUsername },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    setAuth(response.data);
    setNewUsername("");
    setUsernameUpdate(false);
  } catch (error) {
    if (error.response.status === 403) {
      try {
        const response2 = await AxiosInstance.get("/refresh");
        setAuth(response2.data);
        try {
          const response3 = await AxiosInstance.post(
            "/account",
            { username: newUsername },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );
          setAuth(response3.data);
          setNewUsername("");
          setUsernameUpdate(false);
        } catch (error) {
          if (error.response.status === 409) {
            setUsernameTaken(true);
          }
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (error.response.status === 409) {
      setUsernameTaken(true);
    }
    console.log(error);
  }
}

export default changeUsername;
