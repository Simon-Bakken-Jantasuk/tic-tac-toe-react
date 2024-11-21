import { useState } from "react";

export default function Login({ onLoginSubmit }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLoginSubmit(username); // Pass the username to the parent component (Game)
    }
  };

  return (
    <div>
      <h3>Enter your username</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
}