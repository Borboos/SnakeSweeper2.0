import React, { useState, useContext } from "react";
import AcctScoreList from "./AcctScoreList";
import AuthContext from "../AuthContext";
import useFetchAccountData from "../Hooks/useFetchAccountData";
import changeUsername from "../changeUsername";

function Account() {
	const [scores, setScores] = useState();
	const [newUsername, setNewUsername] = useState("");
	const [usernameUpdate, setUsernameUpdate] = useState(false);
	const [usernameTaken, setUsernameTaken] = useState(false);
	const { auth, setAuth } = useContext(AuthContext);

	useFetchAccountData(setScores);

	function handleSubmit(event) {
		event.preventDefault();
		changeUsername(auth, setAuth, newUsername, setNewUsername, setUsernameUpdate, setUsernameTaken);
	}

	return (
		<div>
			<h1>Account Information:</h1>
			<p>Email: {auth.email}</p>
			<p>Username: {auth.username}</p>
			{!usernameUpdate ? (
				<button className="formButton" onClick={() => setUsernameUpdate(true)}>
					Change Username
				</button>
			) : (
				<div>
					<form onSubmit={(event) => handleSubmit(event)}>
						<input
							className="textInput"
							onChange={(event) => setNewUsername(event.target.value)}
							name="newUsername"
							placeholder="Enter new username"
						/>
						<button className="formButton" type="submit">
							Submit
						</button>
					</form>
					{usernameTaken && <p>Username taken</p>}
				</div>
			)}
			{scores ? (
				<div>
					<AcctScoreList game="Snake" scores={scores.snakeScores} />
					<AcctScoreList game="Minesweeper" scores={scores.minesweeperScores} />
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}

export default Account;
