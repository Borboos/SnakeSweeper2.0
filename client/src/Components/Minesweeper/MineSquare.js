import React from "react";
import Bomb from "../Icons/Mine.png";
import Flag from "../Icons/Flag.png";
import Zero from "../Icons/Numbers/0.png";
import One from "../Icons/Numbers/1.png";
import Two from "../Icons/Numbers/2.png";
import Three from "../Icons/Numbers/3.png";
import Four from "../Icons/Numbers/4.png";
import Five from "../Icons/Numbers/5.png";
import Six from "../Icons/Numbers/6.png";
import Seven from "../Icons/Numbers/7.png";
import Eight from "../Icons/Numbers/8.png";

function MineSquare({ square, handleLeftClick, handleRightClick }) {
  return (
    <div
      className={square.flipped ? "Flipped" : "Square"}
      onClick={() => handleLeftClick(square.x, square.y)}
      onContextMenu={(event) => {
        event.preventDefault();
        if (!square.flipped) handleRightClick(square.x, square.y);
      }}
    >
      {!square.flipped && square.flagged && (
        <img className="mineIcon" src={Flag} />
      )}
      {square.flipped && square.bomb && <img className="mineIcon" src={Bomb} />}
      {square.flipped &&
        !square.bomb &&
        {
          0: <img className="mineIcon" src={Zero} />,
          1: <img className="mineIcon" src={One} />,
          2: <img className="mineIcon" src={Two} />,
          3: <img className="mineIcon" src={Three} />,
          4: <img className="mineIcon" src={Four} />,
          5: <img className="mineIcon" src={Five} />,
          6: <img className="mineIcon" src={Six} />,
          7: <img className="mineIcon" src={Seven} />,
          8: <img className="mineIcon" src={Eight} />,
        }[square.adjacentBombs]}
    </div>
  );
}

export default MineSquare;
