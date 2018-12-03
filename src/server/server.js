// WebSockets server in conjunction w/ Express
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const WebSocketServer = require('socket.io')
  .listen(server, { autoConnect: true, transports: ['websocket'] });
const path = require('path');
const Logger = require('./util/log');
const UserController = require('./user/userController');

// Retrieve configuration keys
const { SERVER_PORT } = require('./../config/keys');

// serve up index.html and static files
app.use(express.static(path.resolve(__dirname, './../client/dist')));

// serve up client to test websockets using socket.io/socket.io-client is working
app.get('/testclient', (req, res) => {
  res.sendFile(path.resolve(__dirname, './../test/server/testWSClient.html'));
});

WebSocketServer.on('connection', (socket) => {
  // Reference for how to deliver/listen messages
  // socket.emit('request', /* ... */); // emit an event to the socket
  // WebSocketServer.emit('broadcast', /* … */); // emit an event to all connected sockets
  // socket.on('', () => { /* ... */}); // listen to the event


  // This is called whenever a user connects to the server's port
  UserController.addConnection(socket);

  // Modular Apps pass-thru
  socket.on('app', (message) => {
    Logger.log(`socket connection open (id/msg): ${socket.id} / ${message}`);
    UserController.sendToOneUser(message);
  });

  // video-offer pass-thru
  // Signaling required for WebRTC
  socket.on('video-offer', (message) => {
    Logger.log(`socket connection open (id/msg): ${socket.id} / ${message}`);
    UserController.sendToOneUser(message);
  });

  // video-answer pass-thru
  // Signaling required for WebRTC
  socket.on('video-answer', (message) => {
    Logger.log(`socket connection open (id/msg): ${socket.id} / ${message}`);
    UserController.sendToOneUser(message);
  });

  // hang-up pass-thru
  // Signaling required for WebRTC
  socket.on('hang-up', (message) => {
    Logger.log(`socket connection open (id/msg): ${socket.id} / ${message}`);
    UserController.sendToOneUser(message);
  });

  // new-ice-candidate pass-thru
  // Signaling required for WebRTC
  socket.on('new-ice-candidate', (message) => {
    Logger.log(`socket connection open (id/msg): ${socket.id} / ${message}`);
    UserController.sendToOneUser(message);
  });

  // Public broadcast or private text message
  socket.on('message', (message) => {
    Logger.log(`socket connection open (id/msg): ${socket.id} / ${message}`);
    message.name = UserController.getUserName(message.id);
    message.text = message.text.replace(/(<([^>]+)>)/ig, '');

    // If the message specifies a target username, only send the
    // message to them. Otherwise, send it to every user.
    if (message.target && message.target !== undefined && message.target.length !== 0) {
      UserController.sendToOneUser(message);
    } else {
      const msgString = JSON.stringify(message);
      // Broadcast to all connected sockets
      WebSocketServer.emit(message.type, msgString);
    }
  });

  // Username change
  socket.on('username', (message) => {
    Logger.log(`socket connection open (id/msg): ${socket.id} / ${message}`);
    const retrievedSocket = UserController.getConnectionForID(message.id);
    const origName = message.name;
    let nameChanged = false;

    // Ensure the name is unique by appending a number to it
    // if it's not; keep trying that until it works.
    while (!UserController.isUsernameUnique(message.name)) {
      message.name = origName + UserController.getAppendToMakeUnique();
      nameChanged = true;
    }

    // If the name had to be changed, we send a "rejectusername"
    // message back to the user so they know their name has been
    // altered by the server.
    if (nameChanged) {
      const changeMsg = {
        id: message.id,
        type: 'rejectusername',
        name: message.name,
      };
      retrievedSocket.emit('rejectusername', JSON.stringify(changeMsg));
    }

    // Set this connection's final username and send out the
    // updated user list to all users. Yeah, we're sending a full
    // list instead of just updating. It's horribly inefficient
    // but this is a demo. Don't do this in a real app.
    UserController.setUserName(message.id, message.name);
    UserController.sendUserListToAll(WebSocketServer);
  });

  // event used by http://<server>:port/testCient to verify socket.io WebSockets
  // are working.
  socket.on('test-server', (message) => {
    Logger.log(`socket connection event (id/msg): ${socket.id} / ${message}`);
    socket.emit('test-client', 'Hello Client');
  });

  // Handle the "disconnect" event, this means a user has logged off
  // or has been disconnected.
  socket.on('disconnect', (reason) => {
    Logger.log(`Socket connection closed (id/reason): ${socket.id} / ${reason}`);
    UserController.removeDisconnectedUser();
    // Now send the updated user list. Again, please don't do this in a
    // real application. Your users won't like you very much.
    UserController.sendUserListToAll(WebSocketServer);
  });

  socket.on('error', (error) => {
    Logger.log(`Socket error: ${error}`);
  });
});

// Spin up the HTTP server on the port assigned
server.listen(
  SERVER_PORT,
  () => {
    Logger.log(`Server listening on Port: ${SERVER_PORT}...`);
  },
);
