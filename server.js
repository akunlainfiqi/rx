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

app.get('/sender', (req, res) => {
  res.sendFile(__dirname + '/sender.html')
})

app.get('/receiver', (req,res) => {
  res.sendFile(__dirname + '/receiver.html')
})

let t = "" //latest text
io.on('connection', (socket) => {
  console.log('A user connected');
  
  if (t) {
    socket.emit('text', t)
  }

  socket.on('text', (text) => { //anggep aja bestcase ga dibajak
    console.log(`Text received: ${text}`);
    t = text
    io.emit('text', t);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
