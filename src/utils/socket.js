import { io } from 'socket.io-client';

// const URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:4000" 
const port = process.env.PORT || 4000
// const URL = `wss://tic-tac-toe-react-socketio-03fdff0edcf9.herokuapp.com:${process.env.PORT}` || "http://localhost:4000"
export const socket = io(`wss://testtic-tac-toe-react-socketio-03fdff0edcf9.herokuapp.com:${port}`);