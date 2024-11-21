import { useState, useEffect, useReducer } from "react";
import { socket } from "./utils/socket";
import { Board } from "./components/Board";
// import { History } from "./components/History";
// import { calculateWinner } from "./utils/calculateWinner";
import OnlinePlayers from "./components/OnlinePlayers";
import Login from "./components/Login";
import Reconnect from "./components/Reconnect";


function createInitialState() {
  const history = [{ squares: Array(9).fill(null), lastMove: null }];
  const currentMove = 0;
  const inGame = false;
  const opponent = null;
  const playerTurn = false;
  const room = "";

  return {
    history,
    currentMove,
    inGame,
    opponent,
    playerTurn,
    room,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_HISTORY":
      return { ...state, history: action.payload };
    case "SET_CURRENT_MOVE":
      return { ...state, currentMove: action.payload };
    case "SET_IN_GAME":
      return { ...state, inGame: action.payload };
    case "SET_OPPONENT":
      return { ...state, opponent: action.payload };
    case "SET_PLAYER_TURN":
      return { ...state, playerTurn: action.payload };
    case "SET_ROOM":
      return { ...state, room: action.payload };
    case "RESET_GAME":
      return createInitialState();
    default:
      return state;
  }
}

export default function Game() {
  const [state, dispatch] = useReducer(reducer, createInitialState());

  const { 
    history, 
    currentMove, 
    inGame, 
    opponent, 
    playerTurn, 
    room 
  } = state;

  const [username, setUsername] = useState("");
  const [error, setError] = useState(""); 
  
  const xIsNext = currentMove % 2 === 0;

  // const [sort, setSort] = useState(false);
  
  const currentSquares = history[currentMove];

  const handleLoginSubmit = (inputUsername) => {
    socket.emit("validateUsername", inputUsername, (isValid) => {
      if (isValid) {
        setUsername(inputUsername); 
        socket.emit("addUser", inputUsername); 
      } else {
        setError("Username is already taken. Please choose another.");
        alert("error");
      }
    });
  };

  useEffect(() => {
    socket.on("opponentLeft", () => {
      handleReset();
    })

    socket.on("updateBoard", (data) => {
      updateBoard(data.squares, data.squareIndex);
    })

    socket.on("changeTurn", (turn) => dispatch({ type: "SET_PLAYER_TURN", payload: turn }));

    socket.on("gameAccepted", (room) => {
      dispatch({ type: "SET_ROOM", payload: room });
      dispatch({ type: "SET_IN_GAME", payload: true });
    })

    return () => {
      socket.off("opponentLeft");
      socket.off("updateBoard");
      socket.off("changeTurn");
      socket.off("gameAccepted");
    }

  }, [history, currentMove]);

  function handlePlay(nextSquares, squareIndex) {
    if (!playerTurn) return; 

    dispatch({ type: "SET_PLAYER_TURN", payload: false });

    socket.emit("playMove", {
      player: username,
      opponent: opponent,
      room: room,
      squares: nextSquares,
      squareIndex: squareIndex,
    });
  }

  function updateBoard(nextSquares, squareIndex) {
    const nextHistory = [
      ...history,
      { squares: nextSquares, lastMove: squareIndex }
    ];

    dispatch({ type: "SET_HISTORY", payload: nextHistory });
    dispatch({ type: "SET_CURRENT_MOVE", payload: nextHistory.length - 1 });
  }

  function startGameWith(player, playerTurn) {
    dispatch({ type: "SET_OPPONENT", payload: player });
    dispatch({ type: "SET_PLAYER_TURN", payload: playerTurn }); 
  }

  function handleReset() {
    dispatch({ type: "RESET_GAME" });
  }


  return (
    <div className="game">
      {!username ? (
        <Login onLoginSubmit={handleLoginSubmit} />
      ) : (
        <>
          <OnlinePlayers 
            username={username} 
            onGameStart={startGameWith} 
          />
          {inGame && (
              <Board 
                room={room} 
                xIsNext={xIsNext} 
                squares={currentSquares.squares} 
                onPlay={handlePlay} 
                onReset={handleReset} 
              />
          )}
        </>
      )}
    </div>
  );
}

{/* <History sort={sort} moves={moves} setSort={setSort} /> */}