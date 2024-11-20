import React, { useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Layout from "./Layout";
import RequireAuth from "./RequireAuth";
import Home from "./Home";
import SnakeGrid from "./Snake/SnakeGrid";
import MineGrid from "./Minesweeper/MineGrid";
import Leaderboard from "./Leaderboard";
import Register from "./Register";
import Login from "./Login";
import Account from "./Account";
import Missing from "./Missing";
import AuthContext from "../AuthContext";
import AxiosInstance from "../AxiosInstance";

function App() {
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    async function fetchAuth() {
      try {
        const response = await AxiosInstance.get("/refresh");
        setAuth(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAuth();
  }, []);

  return (
    <div className="AppContainer">
      <NavBar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/snake" element={<SnakeGrid />} />
          <Route path="/minesweeper" element={<MineGrid />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="account" element={<Account />} />
          </Route>
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
