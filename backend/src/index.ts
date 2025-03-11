import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow frontend origin
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Example: Listen for a custom event
  socket.on('pollCreated', (newPoll) => {
    console.log('Poll created:', newPoll);
    io.emit('pollCreated', newPoll); // Broadcast the message to all clients
  });

  socket.on('pollUpdated', (pollUpdated) => {
    console.log('Poll updated:', pollUpdated);
    io.emit('pollUpdated', pollUpdated); // Broadcast the message to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});