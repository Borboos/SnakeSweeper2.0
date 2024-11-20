import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import AxiosInstance from "../AxiosInstance";

function NavBar() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogOut() {
    await AxiosInstance.get("/logout");
    setAuth({});
    navigate("/");
  }

  return (
    <div>
      <nav>
        <div>
          <Link to="/">Home</Link>
          <Link to="/snake">Snake</Link>
          <Link to="/minesweeper">Minesweeper</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>
        <div>
          {auth.token ? (
            <div>
              <Link to="/account">Account</Link>
              <button onClick={() => handleLogOut()}>Logout</button>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
