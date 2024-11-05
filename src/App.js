import { useState } from 'react';

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), lastMove: null}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sort, setSort] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, squareIndex) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, lastMove: squareIndex}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    if (nextSquares.every(square => square !== null) && !calculateWinner(nextSquares)) {
      alert("It's a draw!");
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((currentHistory, move) => {
    let description;
    if (move == currentMove) {
      description = `You are at # ${move}`
      return (
        <li key={move}>
          <p>{description}</p>
        </li>
      );
    } else if (move > 0){
      const row = Math.floor(currentHistory.lastMove / 3) + 1;
      const col = (currentHistory.lastMove % 3) + 1;
      description = `Go to move # (${row}, ${col})`;
    } else {
      description = "Go to game start";
    }
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares.squares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={() => setSort(!sort)}>{sort ? "Sort in acending order" : "Sort in decending order"}</button>
        <ol>{sort ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}

function Square({value, onSquareClick, color}) {
  return <button className={!color ? "square" : `square ${color}`} onClick={onSquareClick}>{value}</button>;
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) { return };
    const nextSquares = squares.slice(); 
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    };
    onPlay(nextSquares, i); 
  }


  let status;
  const winner = calculateWinner(squares);
  if (winner) {
    status = `Winner: ${winner.name}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  } 

  return (
    <>
      <div className="status">{status}</div>
      {Array(3).fill(null).map((_, rowIndex)=> {
        return (
          <div className="board-row" key={rowIndex}>
            {Array(3).fill(null).map((_, colIndex) => {
              const squareIndex = rowIndex * 3 + colIndex;

              return (
                <Square 
                  key={squareIndex} 
                  value={squares[squareIndex]} 
                  onSquareClick={() => handleClick(squareIndex)}
                  color={getColorIndicator(squareIndex, winner)}
                />
              );

            })}
          </div>
        );
      })}
    </>
  );
}

function calculateWinner(squares) {
    const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { name: squares[a], index: lines[i]};
    }
  }
  return null;
}

function getColorIndicator(squareIndex, winner) {
  if (winner && winner.index.includes(squareIndex)) {
    return "green"; 
  } else if (winner) {
    return "red";
  } 
  return null; 
}