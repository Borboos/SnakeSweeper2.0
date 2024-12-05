import React, { useEffect, useState } from "react";
import SnakeGameOver from "./SnakeGameOver";
import SnakeSquare from "./SnakeSquare";
import Apple from "../Icons/Apple.png";

function SnakeGrid() {
  const GRID_SIZE = 16;
  const [squareList, setSquareList] = useState(getInitGrid(GRID_SIZE));
  const [paused, setPaused] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [headDirection, setHeadDirection] = useState("left");
  const [tempDirection, setTempDirection] = useState("left");
  const [fruitNum, setFruitNum] = useState(Math.ceil(Math.random() * 3));
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [frameTime, setFrameTime] = React.useState(performance.now());

  useEffect(() => {
    document.getElementById("SnakeGrid").focus();
    let frameId;
    const frame = (time) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    function updateFruit(list) {
      let currFruit = list.find((square) => square.fruit);
      let currHead = list.find((square) => square.head);
      let currBody = list.filter((square) => square.bodyPos > 0);
      let nextFruit = getSquare(
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE),
        list
      );
      while (
        nextFruit === currFruit ||
        nextFruit === currHead ||
        currBody.includes(nextFruit)
      ) {
        nextFruit = getSquare(
          Math.floor(Math.random() * GRID_SIZE),
          Math.floor(Math.random() * GRID_SIZE),
          list
        );
      }
      currFruit.fruit = false;
      nextFruit.fruit = true;
      const biteSound = new Audio(`./sounds/bite.mp3`);
      biteSound.play();
      return Math.ceil(Math.random() * 3);
    }

    function gameLoop() {
      if (!paused && !gameOver) {
        let tempSquareList = structuredClone(squareList);
        let currHead = tempSquareList.find((square) => square.head);
        let currBody = tempSquareList.filter((square) => square.bodyPos > 0);
        currHead.head = false;
        setHeadDirection(tempDirection);
        const nextHead = getNextSquare(tempDirection, currHead, tempSquareList);
        if (nextHead === undefined || currBody.includes(nextHead)) {
          setGameOver(true);
          const bounceSound = new Audio(`./sounds/death.wav`);
          bounceSound.play();
        } else {
          nextHead.head = true;
          currHead.bodyPos = 1;
          currBody.forEach((square) => square.bodyPos++);
          if (nextHead.fruit) {
            setFruitNum(updateFruit(tempSquareList));
            setScore(score + 1);
          } else {
            let tail = getTail(tempSquareList);
            if (tail) {
              tail.bodyPos = 0;
            }
          }
          setSquareList(tempSquareList);
        }
      }
    }
    if (frameTime - lastTimestamp >= 75) {
      setLastTimestamp(frameTime);
      gameLoop();
    }
  }, [
    frameTime,
    lastTimestamp,
    gameOver,
    paused,
    score,
    squareList,
    tempDirection,
  ]);

  function getInitGrid(size) {
    let initialSquareList = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        initialSquareList.push({
          x: i,
          y: j,
          bodyPos: 0,
          head: false,
          fruit: false,
        });
      }
    }
    const head = initialSquareList.find(
      (square) => square.x === 8 && square.y === 8
    );
    let firstFruit = getSquare(
      Math.floor(Math.random() * 16),
      Math.floor(Math.random() * 16),
      initialSquareList
    );
    while (firstFruit === head) {
      firstFruit = getSquare(
        Math.floor(Math.random() * 16),
        Math.floor(Math.random() * 16),
        initialSquareList
      );
    }
    head.head = true;
    firstFruit.fruit = true;
    return initialSquareList;
  }

  function getSquare(x, y, list) {
    return list.find((square) => square.x === x && square.y === y);
  }

  function getTail(list) {
    const tail = list.reduce((accumulator, currentSquare) => {
      return accumulator.bodyPos > currentSquare.bodyPos
        ? accumulator
        : currentSquare;
    });
    return tail;
  }

  function getNextSquare(tempDirection, currHead, tempSquareList) {
    switch (tempDirection) {
      case "left":
        return tempSquareList.find(
          (square) => square.x === currHead.x && square.y === currHead.y - 1
        );
      case "right":
        return tempSquareList.find(
          (square) => square.x === currHead.x && square.y === currHead.y + 1
        );
      case "up":
        return tempSquareList.find(
          (square) => square.x === currHead.x - 1 && square.y === currHead.y
        );
      case "down":
        return tempSquareList.find(
          (square) => square.x === currHead.x + 1 && square.y === currHead.y
        );
      default:
        return null;
    }
  }

  function updateHeadDirection(key) {
    switch (key) {
      case "ArrowLeft":
        if (headDirection !== "right") {
          setTempDirection("left");
        }
        break;
      case "ArrowRight":
        if (headDirection !== "left") {
          setTempDirection("right");
        }
        break;
      case "ArrowDown":
        if (headDirection !== "up") {
          setTempDirection("down");
        }
        break;
      case "ArrowUp":
        if (headDirection !== "down") {
          setTempDirection("up");
        }
        break;
      case " ":
        setPaused(!paused);
        break;
      default:
        break;
    }
  }

  function resetGame() {
    setSquareList(getInitGrid(GRID_SIZE));
    setPaused(true);
    setGameOver(false);
    setScore(0);
    setHeadDirection("left");
    setTempDirection("left");
    setFruitNum(Math.ceil(Math.random() * 3));
    setLastTimestamp(0);
    setFrameTime(performance.now());
    document.getElementById("SnakeGrid").focus();
  }

  return (
    <div>
      <h1 className="gameTitle">Snake</h1>
      <div id="GameGridContainer">
        <div id="unmarkedText">
          {String(score).padStart(3, "0")}
          <img src={Apple}></img>
        </div>
        <div
          id="SnakeGrid"
          onKeyDown={(event) => {
            event.preventDefault();
            updateHeadDirection(event.key);
          }}
          tabIndex={0}
        >
          {squareList.map((square, index) => (
            <SnakeSquare
              key={index}
              square={square}
              fruitNum={fruitNum}
              headDirection={headDirection}
            />
          ))}
        </div>
      </div>
      {gameOver ? (
        <div>
          <SnakeGameOver score={score} resetGame={resetGame} />
        </div>
      ) : (
        <div>
          <p>Collect as many fruits as you can. </p>
          <p>Avoid going out of bounds or hitting your tail.</p>
          <p>Use the space bar to start and pause/unpause the game.</p>
        </div>
      )}
    </div>
  );
}

export default SnakeGrid;
