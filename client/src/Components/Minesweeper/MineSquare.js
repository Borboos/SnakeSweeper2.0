import React from "react";
import Bomb from "../Icons/Bomb";
import Flag from "../Icons/Flag";

function MineSquare({ square, handleLeftClick, handleRightClick }) {
  return (
    <div
      className={
        (square.flipped ? "Flipped" : "Square") +
        (square.adjacentBombs === 1 ? " OneClose" : "") +
        (square.adjacentBombs === 2 ? " TwoClose" : "") +
        (square.adjacentBombs > 2 ? " ThreePlusClose" : "")
      }
      onClick={() => handleLeftClick(square.x, square.y)}
      onContextMenu={(event) => {
        event.preventDefault();
        handleRightClick(square.x, square.y);
      }}
    >
      {!square.flipped && square.flagged && <Flag />}
      {square.flipped && square.bomb && <Bomb />}
      {square.flipped &&
        !square.bomb &&
        square.adjacentBombs > 0 &&
        square.adjacentBombs.toString()}
      {square.flipped && !square.bomb && square.adjacentBombs === 0 && "/"}
    </div>
  );
}

export default MineSquare;
