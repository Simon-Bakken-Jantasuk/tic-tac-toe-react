import { calculateWinner } from "../utils/calculateWinner";
import { getColorIndicator } from "../utils/getColorIndicator";
import { Square } from "./Square";

export function Board({ xIsNext, squares, onPlay }) {
  function handleClick(squareIndex) {
    if (squares[squareIndex] || calculateWinner(squares)) { return; };
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[squareIndex] = "X";
    } else {
      nextSquares[squareIndex] = "O";
    };
    onPlay(nextSquares, squareIndex);
  }


  let status;
  const winner = calculateWinner(squares);
  if (winner) {
    status = `Winner: ${winner.name}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

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
