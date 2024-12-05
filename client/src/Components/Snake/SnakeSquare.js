import React from "react";
import Apple from "../Icons/Fruits/Apple.png";
import Orange from "../Icons/Fruits/Orange.png";
import Banana from "../Icons/Fruits/Banana.png";
import ArrowLeft from "../Icons/SnakePieces/ArrowLeft.png";
import ArrowRight from "../Icons/SnakePieces/ArrowRight.png";
import ArrowUp from "../Icons/SnakePieces/ArrowUp.png";
import ArrowDown from "../Icons/SnakePieces/ArrowDown.png";
import Body from "../Icons/SnakePieces/Body.png";

function SnakeSquare({ square, fruitNum, headDirection }) {
  return (
    <div className="SnakeSquare">
      {square.fruit && fruitNum === 1 && (
        <img className="snakeIcon" src={Apple} />
      )}
      {square.fruit && fruitNum === 2 && (
        <img className="snakeIcon" src={Orange} />
      )}
      {square.fruit && fruitNum === 3 && (
        <img className="snakeIcon" src={Banana} />
      )}
      {square.head && headDirection === "left" && (
        <img className="snakeIcon" src={ArrowLeft} />
      )}
      {square.head && headDirection === "right" && (
        <img className="snakeIcon" src={ArrowRight} />
      )}
      {square.head && headDirection === "up" && (
        <img className="snakeIcon" src={ArrowUp} />
      )}
      {square.head && headDirection === "down" && (
        <img className="snakeIcon" src={ArrowDown} />
      )}
      {square.bodyPos > 0 && <img className="snakeIcon" src={Body} />}
    </div>
  );
}

export default SnakeSquare;
