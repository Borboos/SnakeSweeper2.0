import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { validate } from "email-validator";
import AuthContext from "../AuthContext";
import AxiosInstance from "../AxiosInstance";

function Login() {
  const { setAuth } = useContext(AuthContext);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [submissionError, setSubmissionError] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (validate(values.email)) {
      try {
        const response = await AxiosInstance.post("/login", values, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        setAuth(response.data);
        navigate("/");
      } catch (error) {
        setSubmissionError(error.response.data.error);
        console.log(error);
      }
    }
  }
  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          onChange={(event) => handleChange(event)}
          name="email"
          placeholder="Enter E-mail"
        />
        <input
          onChange={(event) => handleChange(event)}
          name="password"
          placeholder="Enter Password"
          type="password"
        />
        <button type="submit">Submit</button>
      </form>
      {values.email && !validate(values.email) ? (
        <p>Entered E-mail is not valid</p>
      ) : (
        <div></div>
      )}
      {submissionError ? <p>{submissionError}</p> : <div></div>}
    </div>
  );
}

export default Login;
