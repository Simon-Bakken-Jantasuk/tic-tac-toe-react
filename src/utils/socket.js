import { io } from 'socket.io-client';

const socketURL = process.env.NODE_ENV === "production"
  ? `wss://tic-tac-toe-react-socketio-03fdff0edcf9.herokuapp.com` 
  : "http://localhost:4000"; 

export const socket = io(socketURL);