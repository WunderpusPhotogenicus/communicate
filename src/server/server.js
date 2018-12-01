// WebSockets server in conjunction w/ Express
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path');

// Retrieve configuration keys
const {SERVER_PORT} = require('./../config/keys');

// serve up index.html and static files
app.use(express.static(path.resolve(__dirname, './../client/dist')));

io.on('connection', (socket) => {
  // socket.emit('request', /* ... */); // emit an event to the socket
  // io.emit('broadcast', /* … */); // emit an event to all connected sockets
  // socket.on('', () => { /* ... */}); // listen to the event

  console.log(`socket connection open: ${socket.id}`);

  socket.on('close', () => {
    console.log(`socket connection close: ${socket.id}`);
  });
});
server.listen(
  SERVER_PORT,
  () => {
    console.log(`Listening on Port: ${SERVER_PORT}...`);
  },
);
