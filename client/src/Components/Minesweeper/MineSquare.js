import React from "react";

import Bomb from "../Icons/mine.png";
import Flag from "../Icons/flag.png";

import Zero from "../Icons/0.png";
import One from "../Icons/1.png";
import Two from "../Icons/2.png";
import Three from "../Icons/3.png";
import Four from "../Icons/4.png";
import Five from "../Icons/5.png";
import Six from "../Icons/6.png";
import Seven from "../Icons/7.png";
import Eight from "../Icons/8.png";

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
			{!square.flipped && square.flagged && <img className="mineIcon" src={Flag} />}
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
