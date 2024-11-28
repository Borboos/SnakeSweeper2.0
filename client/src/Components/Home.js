import React from "react";
import { Link } from "react-router-dom";

function Home() {
	return (
		<>
			<h1 id="snakesweeperTitle">Snakesweeper</h1>
			<div id="homeDiv">
				<div className="homeDivGridItem">
					<h2>Snake</h2>
					<Link to="snake">
						<img src="./images/snake.png" />
					</Link>
				</div>
				<div className="homeDivGridItem">
					<h2>Minesweeper</h2>
					<Link to="minesweeper">
						<img src="./images/minesweeper.png"></img>
					</Link>
				</div>
			</div>
		</>
	);
}

export default Home;
