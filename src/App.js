import { useState, useEffect, useRef } from 'react';
import { socket } from './utils/socket';
import { Board } from './components/Board';
import { History } from './components/History';
import { calculateWinner } from './utils/calculateWinner';
import OnlinePlayers from './components/OnlinePlayers';
import Login from './components/Login';

// TODO:
// CHANGE STATES TO USE REDUCER TO HANDLE A WAY TO RESET BOARD
export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), lastMove: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sort, setSort] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [username, setUsername] = useState("");
  const [opponent, setOpponent] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [gameRoom, setGameRoom] = useState("");

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handleLoginSubmit = (username) => {
    setUsername(username);
    socket.emit('join', username); 
  };

  useEffect(() => {
    socket.on('updateBoard', (data) => {
      updateBoard(data.squares, data.squareIndex);
    });

    socket.on('changeTurn', turn => setIsPlayerTurn(turn));

    socket.on("gameAccepted", (room) => {
      setGameRoom(room);
      setInGame(true);
    });

    return () => {
      socket.off("updateBoard");
      socket.off("changeTurn");
      socket.off("gameAccepted");
    };

  }, [history, currentMove]);

  function handlePlay(nextSquares, squareIndex) {
    if (!isPlayerTurn) return; 

    setIsPlayerTurn(false);

    socket.emit('playMove', {
      player: username,
      opponent: opponent,
      room: gameRoom,
      squares: nextSquares,
      squareIndex: squareIndex,
    });
  }

  function updateBoard(nextSquares, squareIndex) {
    const nextHistory = [
      ...history,
      { squares: nextSquares, lastMove: squareIndex }
    ];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function startGameWith(player, playerTurn) {
    setOpponent(player);
    setIsPlayerTurn(playerTurn); 
  }
  
  // function jumpTo(nextMove) {
  //   setCurrentMove(nextMove);
  // }

  // const moves = history.map((currentHistory, move) => {
  //   let description;
  //   if (move === currentMove) {
  //     description = `You are at # ${move}`;
  //     return (
  //       <li key={move}>
  //         <p>{description}</p>
  //       </li>
  //     );
  //   } else if (move > 0) {
  //     const row = Math.floor(currentHistory.lastMove / 3) + 1;
  //     const col = (currentHistory.lastMove % 3) + 1;
  //     description = `Go to move # (${row}, ${col})`;
  //   } else {
  //     description = "Go to game start";
  //   }

  //   return (
  //     <li key={move}>
  //       <button onClick={() => jumpTo(move)}>{description}</button>
  //     </li>
  //   );
  // });

  return (
    <div className="game">
      {!username ? (
        <Login onLoginSubmit={handleLoginSubmit} />
      ) : (
        <>
          <OnlinePlayers username={username} onGameStart={startGameWith} />
          {inGame && (
            <>
              <Board xIsNext={xIsNext} squares={currentSquares.squares} gameRoom={gameRoom} onPlay={handlePlay} />
              {/* <History sort={sort} moves={moves} setSort={setSort} /> */}
            </>
          )}
        </>
      )}
    </div>
  );
}