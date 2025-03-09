import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket'], // Force WebSocket transport
});

socket.on('connect', () => {
  console.log('Socket.IO client connected:', socket.connected);
});

socket.on('connect_error', (error) => {
  console.error('Socket.IO connection error:', error);
});

export default socket;