import { useState } from 'react';
import { Board } from './components/Board';
import { History } from './components/History';
import { calculateWinner } from './utils/calculateWinner';

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
      <Board xIsNext={xIsNext} squares={currentSquares.squares} onPlay={handlePlay}/>
      <History sort={sort} moves={moves} setSort={setSort} />
    </div>
  );
}