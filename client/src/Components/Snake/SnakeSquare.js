import React from "react";
import Apple from "../Icons/Apple";
import Orange from "../Icons/Orange";
import Banana from "../Icons/Banana";
import ArrowLeft from "../Icons/ArrowLeft";
import ArrowRight from "../Icons/ArrowRight";
import ArrowUp from "../Icons/ArrowUp";
import ArrowDown from "../Icons/ArrowDown";
import Circle from "../Icons/Circle";

function SnakeSquare({ square, fruitNum, headDirection }) {
  return (
    <div className="SnakeSquare">
      {square.fruit && fruitNum === 1 ? <Apple /> : <div></div>}
      {square.fruit && fruitNum === 2 ? <Orange /> : <div></div>}
      {square.fruit && fruitNum === 3 ? <Banana /> : <div></div>}
      {square.head && headDirection === "left" ? <ArrowLeft /> : <div></div>}
      {square.head && headDirection === "right" ? <ArrowRight /> : <div></div>}
      {square.head && headDirection === "up" ? <ArrowUp /> : <div></div>}
      {square.head && headDirection === "down" ? <ArrowDown /> : <div></div>}
      {square.bodyPos > 0 ? <Circle /> : <div></div>}
    </div>
  );
}

export default SnakeSquare;
