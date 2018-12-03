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
  // socket.emit('request', /* ... */); // emit an event to the socket
  // io.emit('broadcast', /* … */); // emit an event to all connected sockets
  // socket.on('', () => { /* ... */}); // listen to the event


  // This is called whenever a user connects to the server's port
  UserController.addConnection(socket);

  // Public, textual message
  socket.on('message', (message) => {
    const retrievedSocket = UserController.getConnectionForID(message.id);
    message.name = retrievedSocket.username;
    message.text = message.text.replace(/(<([^>]+)>)/ig, '');
  });

  // Username change
  socket.on('username', (message) => {
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
    sendToClients = false;  // We already sent the proper responses  ???????????????
  });


  // *************************************************************************
  /*

    // Set up a handler for the "message" event received over WebSocket. This
    // is a message sent by a client, and may be text to share with other
    // users, a private message (text or signaling) for one user, or a command
    // to the server.

    // Process incoming data.
    var sendToClients = true;
    var storedSocket = getConnectionForID(msg.id);

    // Unknown message types are passed through,
    // since they may be used to implement client-side features.
    // Messages with a "target" property are sent only to a user
    // by that name.

    // Convert the revised message back to JSON and send it out
    // to the specified client or all clients, as appropriate. We
    // pass through any messages not specifically handled
    // in the select block above. This allows the clients to
    // exchange signaling and other control objects unimpeded.

    if (sendToClients) {
      var msgString = JSON.stringify(msg);
      var i;

      // If the message specifies a target username, only send the
      // message to them. Otherwise, send it to every user.
      if (msg.target && msg.target !== undefined && msg.target.length !== 0) {
        sendToOneUser(msg.target, msgString);
      } else {
        for (i=0; i<connectionArray.length; i++) {
          connectionArray[i].sendUTF(msgString);
        }
      }
    }
  );
*/
  // *************************************************************************


  // event used by http://<server>:port/testCient to verify socket.io WebSockets
  // are working.
  socket.on('test-server', (message) => {
    Logger.log(`socket connection open (id/msg): ${socket.id} / ${message}`);
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
