// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');
  io.emit('message', 'A new user has joined');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.onAny((eventName, ...args) => {
    console.log(`Ignoring event '${eventName}' from client`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
