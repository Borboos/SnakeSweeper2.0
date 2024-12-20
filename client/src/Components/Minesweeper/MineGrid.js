import React, { useState, useEffect, useRef } from "react";
import MineSquare from "./MineSquare";
import MineGameOver from "./MineGameOver";
import Mine from "../Icons/Mine.png";

function MineGrid() {
  const GRID_SIZE = 16;
  const MINE_COUNT = 40;
  const [squareList, setSquareList] = useState(
    getInitGrid(GRID_SIZE, MINE_COUNT)
  );
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstSquareClicked, setFirstSquareClicked] = useState(false);
  const [timer, setTimer] = useState(0);
  const [finalTime, setFinalTime] = useState("");
  const [flagsLeft, setFlagsLeft] = useState(40);
  let visitedSquares = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const flagsRemaining =
      MINE_COUNT - squareList.filter((square) => square.flagged).length;
    setFlagsLeft(flagsRemaining);
  }, [squareList]);

  function getInitGrid() {
    let initialSquareList = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        initialSquareList.push({
          x: i,
          y: j,
          adjacentMines: 0,
          flipped: false,
          flagged: false,
          mine: false,
          hovered: false,
        });
      }
    }
    for (let i = 0; i < MINE_COUNT; i++) {
      let randX = Math.floor(Math.random() * GRID_SIZE);
      let randY = Math.floor(Math.random() * GRID_SIZE);
      let randSquare = getSquare(randX, randY, initialSquareList);
      while (randSquare.mine) {
        randX = Math.floor(Math.random() * GRID_SIZE);
        randY = Math.floor(Math.random() * GRID_SIZE);
        randSquare = getSquare(randX, randY, initialSquareList);
      }
      randSquare.mine = true;
    }
    initialSquareList.forEach((currentSquare) => {
      const adjacentSquares = initialSquareList.filter(
        (square) =>
          !(currentSquare.x === square.x && currentSquare.y === square.y) &&
          Math.abs(currentSquare.x - square.x) <= 1 &&
          Math.abs(currentSquare.y - square.y) <= 1
      );
      adjacentSquares.forEach((adjacentSquare) => {
        if (adjacentSquare.mine) currentSquare.adjacentMines++;
      });
    });
    return initialSquareList;
  }

  function getSquare(x, y, list) {
    return list.find((square) => square.x === x && square.y === y);
  }

  function getFlagsLeft(squareList) {
    return 40 - squareList.filter((square) => square.flagged).length;
  }

  function getTime(timer) {
    const minutes = Math.floor(timer / 60);
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = timer % 60;
    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutesStr}:${secondsStr}`;
  }

  function flipAdjacentSquares(x, y, list) {
    const currentSquare = getSquare(x, y, list);
    visitedSquares.current = [...visitedSquares.current, currentSquare];
    if (currentSquare.mine) return;
    else {
      currentSquare.flipped = true;
      if (currentSquare.flagged) currentSquare.flagged = false;
      if (currentSquare.adjacentMines === 0) {
        const adjacentSquaresWithoutMinesNotVisited = list.filter(
          (square) =>
            !(currentSquare.x === square.x && currentSquare.y === square.y) &&
            Math.abs(currentSquare.x - square.x) <= 1 &&
            Math.abs(currentSquare.y - square.y) <= 1 &&
            !square.mine &&
            !visitedSquares.current.includes(square)
        );
        adjacentSquaresWithoutMinesNotVisited.forEach((square) =>
          flipAdjacentSquares(square.x, square.y, list)
        );
      }
    }
  }

  function endGame(gameWon) {
    if (gameWon) {
      setGameOver(true);
      setGameWon(true);
      const victorySound = new Audio(`./sounds/victory.mp3`);
      victorySound.volume = 0.25;
      victorySound.play();
    } else {
      setGameOver(true);
    }
    setFinalTime(timer);
  }

  function handleLeftClick(x, y) {
    if (!gameOver) {
      let tempList = [...squareList];
      let clickedSquare = getSquare(x, y, tempList);
      if (clickedSquare.flagged) {
        return;
      }
      if (!firstSquareClicked) {
        while (clickedSquare.mine) {
          tempList = getInitGrid(GRID_SIZE, MINE_COUNT);
          clickedSquare = getSquare(x, y, tempList);
        }
        setFirstSquareClicked(true);
        setTimer(0);
      }
      clickedSquare.flipped = true;
      if (clickedSquare.mine) {
        const explosionSound = new Audio(`./sounds/explosion.mp3`);
        explosionSound.volume = 0.25;
        explosionSound.play();
        endGame(false);
      } else {
        clickedSquare.flipped = true;
        flipAdjacentSquares(x, y, tempList);
        if (
          GRID_SIZE * GRID_SIZE -
            squareList.filter((square) => square.flipped).length ===
          MINE_COUNT
        )
          endGame(true);
      }
      setSquareList([...tempList]);
    }
  }

  function handleRightClick(x, y) {
    if (!gameOver && firstSquareClicked) {
      const newList = [...squareList];
      const clickedSquare = getSquare(x, y, newList);
      if (clickedSquare.flagged) {
        clickedSquare.flagged = false;
      } else {
        if (getFlagsLeft(squareList) > 0) {
          clickedSquare.flagged = true;
        }
      }
      setSquareList(newList);
    }
  }

  function resetGame() {
    setSquareList(getInitGrid(GRID_SIZE, MINE_COUNT));
    setGameOver(false);
    setGameWon(false);
    setFirstSquareClicked(false);
    setTimer(0);
    setFinalTime(0);
    setFlagsLeft(40);
    visitedSquares.current = [];
  }

  return (
    <div>
      <h1 className="gameTitle">Minesweeper</h1>
      <div id="GameGridContainer">
        <div id="unmarkedText">
          {String(flagsLeft).padStart(2, "0")}
          <img src={Mine}></img>
        </div>
        <div id="GameGrid" className="Grid">
          {squareList.map((square, index) => (
            <MineSquare
              key={index}
              square={square}
              handleLeftClick={handleLeftClick}
              handleRightClick={handleRightClick}
            />
          ))}
        </div>
      </div>
      {firstSquareClicked && !gameOver ? (
        <h2>Time Elapsed: {getTime(timer)}</h2>
      ) : (
        <div></div>
      )}
      {gameOver ? (
        <MineGameOver
          gameWon={gameWon}
          resetGame={resetGame}
          finalTime={finalTime}
          getTime={getTime}
        />
      ) : (
        <div>
          <p>Flip all non-mined squares by left-clicking to win.</p>
          <p>Use right-clicking to mark unflipped mines.</p>
          <p>Avoid detonating mines.</p>
        </div>
      )}
    </div>
  );
}

export default MineGrid;
