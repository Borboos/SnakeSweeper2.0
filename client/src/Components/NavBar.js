import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import AxiosInstance from "../AxiosInstance";

function NavBar() {
	const { auth, setAuth } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();

	async function handleLogOut() {
		await AxiosInstance.get("/logout");
		setAuth({});
		navigate("/");
	}

	return (
		<div id="navBarContainer">
			<div id="navBar">
				<ul>
					<li className={location.pathname === "/" ? "chosenLink" : undefined}>
						<Link to="/">Home</Link>
					</li>
					<li className={location.pathname === "/snake" ? "chosenLink" : undefined}>
						<Link to="/snake">Snake</Link>
					</li>
					<li className={location.pathname === "/minesweeper" ? "chosenLink" : undefined}>
						<Link to="/minesweeper">Minesweeper</Link>
					</li>
					<li className={location.pathname === "/leaderboard" ? "chosenLink" : undefined}>
						<Link to="/leaderboard">Leaderboard</Link>
					</li>

					{auth.token ? (
						<>
							<li className={location.pathname === "/account" ? "chosenLink" : undefined}>
								<Link to="/account">Account</Link>
							</li>

							<li>
								<a onClick={() => handleLogOut()}>Logout</a>
							</li>
						</>
					) : (
						<>
							<li className={location.pathname === "/login" ? "chosenLink" : undefined}>
								<Link to="/login">Login</Link>
							</li>
							<li className={location.pathname === "/register" ? "chosenLink" : undefined}>
								<Link to="/register">Register</Link>
							</li>
						</>
					)}
				</ul>
			</div>
		</div>
	);
}

export default NavBar;
