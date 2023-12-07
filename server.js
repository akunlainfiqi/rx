// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs')
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

app.get('/test', (req,res) => {
  res.sendFile(__dirname + '/test.html')
})

let t = "" //latest text
io.on('connection', (socket) => {
  console.log('A user connected');
  
  if (t) {
    socket.emit('text', t)
  }

  socket.on('text', async (text) => { //anggep aja bestcase ga dibajak
    console.log(`Text received: ${text}`);
    let data = fs.readFileSync('word-store.json')
    let words = JSON.parse(data)
    if (words.hasOwnProperty(text)) {
      words[text]++
    } else words[text] = 1
    fs.writeFileSync('word-store.json', JSON.stringify(words))
    io.emit('text', words);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
