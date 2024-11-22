import React from "react";
import Apple from "../Icons/Apple.png";
import Banana from "../Icons/Banana.png";
import Orange from "../Icons/Orange.png";
import ArrowLeft from "../Icons/ArrowLeft.png";
import ArrowRight from "../Icons/ArrowRight.png";
import ArrowUp from "../Icons/ArrowUp.png";
import ArrowDown from "../Icons/ArrowDown.png";
import Body from "../Icons/Body.png";

function SnakeSquare({ square, fruitNum, headDirection }) {
	return (
		<div className="SnakeSquare">
			{square.fruit && fruitNum === 1 && <img className="snakeIcon" src={Apple} />}
			{square.fruit && fruitNum === 2 && <img className="snakeIcon" src={Orange} />}
			{square.fruit && fruitNum === 3 && <img className="snakeIcon" src={Banana} />}
			{square.head && headDirection === "left" && <img className="snakeIcon" src={ArrowLeft} />}
			{square.head && headDirection === "right" && <img className="snakeIcon" src={ArrowRight} />}
			{square.head && headDirection === "up" && <img className="snakeIcon" src={ArrowUp} />}
			{square.head && headDirection === "down" && <img className="snakeIcon" src={ArrowDown} />}
			{square.bodyPos > 0 && <img className="snakeIcon" src={Body} />}
		</div>
	);
}

export default SnakeSquare;
