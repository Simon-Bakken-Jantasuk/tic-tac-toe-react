import { useEffect } from "react";
import { calculateWinner } from "../utils/calculateWinner";
import { getColorIndicator } from "../utils/getColorIndicator";
import { socket } from "../utils/socket";
import { Square } from "./Square";

export function Board({ xIsNext, squares, gameRoom, onPlay }) {
  let status;
  const winner = calculateWinner(squares);
  
  if (winner) {
    status = `Winner: ${winner.name}`;
  } else if (squares.every(square => square !== null) && !winner) {
    status = "There is a draw";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  };

  function handleClick(squareIndex) {
    if (squares[squareIndex] || calculateWinner(squares))  return; 

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[squareIndex] = "X";
    } else {
      nextSquares[squareIndex] = "O";
    }
    onPlay(nextSquares, squareIndex);  
  };

  return (
    <div className="game-board">
      <div className="status">{status}</div>
      {Array(3).fill(null).map((_, rowIndex) => {
        return (
          <div className="board-row" key={rowIndex}>
            {Array(3).fill(null).map((_, colIndex) => {
              const squareIndex = rowIndex * 3 + colIndex;
              return (
                <Square
                  key={squareIndex}
                  value={squares[squareIndex]}
                  onSquareClick={() => handleClick(squareIndex)}
                  color={getColorIndicator(squareIndex, winner)} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}