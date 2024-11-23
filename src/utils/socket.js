import { io } from 'socket.io-client';

const socketURL = process.env.NODE_ENV === "production"
  ? `wss://mysterious-ravine-23326-f566692a40b9.herokuapp.com/` 
  : "http://localhost:4000"; 

export const socket = io(socketURL);