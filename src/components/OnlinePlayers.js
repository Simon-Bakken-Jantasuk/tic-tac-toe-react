import { useState, useEffect } from "react";
import { socket } from "../utils/socket";

export default function OnlinePlayers({username, onGameStart}) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on("onlinePlayers", (playersList) => {
      setPlayers(playersList);
    });

    socket.on("gameRequest", (fromUsername) => {
      if (window.confirm(`${fromUsername} wants to play. Accept?`)) {
        socket.emit("acceptRequest", fromUsername);
        onGameStart(fromUsername, true);
      }
    });
    
    socket.on("acceptRequest", (fromUsername) => {
      onGameStart(fromUsername, false);
    });

    console.log(players);

    return () => {
      socket.off("onlinePlayers");
      socket.off("gameRequest");
      socket.off("acceptRequest");
    };

  }, [players]);

  function sendGameRequest(player) {
    socket.emit("gameRequest", player);
  }

  const broadcastPlayers = players.map((player, index) => {
    if (player !== username) {
      return (
        <li key={index}>
          {player}
          <button onClick={() => sendGameRequest(player)}>Play</button>
        </li>
      )
    }
  })

  return (
    <div>
      <h3>Online Players</h3>
      <p>You are logged in as: {username}</p>
      <ul>{broadcastPlayers}</ul>
    </div>
  );
}