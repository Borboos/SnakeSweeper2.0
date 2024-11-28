import React from "react";
import Apple from "../Icons/Apple.png";
import Banana from "../Icons/Banana.png";
import Orange from "../Icons/Orange.png";

function SnakeSquare({ square, fruitNum, headDirection, variant }) {
	return (
		<div className="SnakeSquare">
			{square.fruit && fruitNum === 1 && <img className="snakeIcon" src={Apple} />}
			{square.fruit && fruitNum === 2 && <img className="snakeIcon" src={Orange} />}
			{square.fruit && fruitNum === 3 && <img className="snakeIcon" src={Banana} />}
			{square.head && headDirection === "left" && <img className="snakeIcon" src={variant.Left} />}
			{square.head && headDirection === "right" && <img className="snakeIcon" src={variant.Right} />}
			{square.head && headDirection === "up" && <img className="snakeIcon" src={variant.Up} />}
			{square.head && headDirection === "down" && <img className="snakeIcon" src={variant.Down} />}
			{square.bodyPos > 0 && <img className="snakeIcon" src={variant.Body} />}
		</div>
	);
}

export default SnakeSquare;
