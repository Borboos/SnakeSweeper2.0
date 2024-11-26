import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validate } from "email-validator";
import AxiosInstance from "../AxiosInstance";

function Register() {
  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [registerSuccessful, setRegisterSuccessful] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (values.password === values.passwordConfirm && validate(values.email)) {
      try {
        await AxiosInstance.post("/register", values, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        setRegisterSuccessful(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
          name="username"
          placeholder="Enter Username"
        />
        <input
          onChange={(event) => handleChange(event)}
          name="password"
          placeholder="Enter Password"
          type="password"
        />
        <input
          onChange={(event) => handleChange(event)}
          name="passwordConfirm"
          placeholder="Re-Enter Password"
          type="password"
        />
        <button type="submit">Submit</button>
      </form>
      {values.password &&
      values.passwordConfirm &&
      values.password !== values.passwordConfirm ? (
        <p>Entered Passwords do not match</p>
      ) : (
        <div></div>
      )}
      {values.email && !validate(values.email) ? (
        <p>Entered E-mail is not valid</p>
      ) : (
        <div></div>
      )}
      {submissionError ? <p>{submissionError}</p> : <div></div>}
      {registerSuccessful && <p>Registration Successful</p>}
    </div>
  );
}

export default Register;
