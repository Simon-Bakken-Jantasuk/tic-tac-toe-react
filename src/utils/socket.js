import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
// const URL = process.env.CLIENT_URL || "http://localhost:4000"

const URL = "https://tic-tac-toe-react-socketio-03fdff0edcf9.herokuapp.com:4000"
export const socket = io(URL);