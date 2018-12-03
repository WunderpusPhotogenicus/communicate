const uuidv4 = require('uuid/v4');
const Logger = require('./../util/log');

// Used for managing the user list.
let connectionArray = [];
let appendToMakeUnique = 0;

const UserController = {
  // Add the new connection to our list of connections.
  addConnection: (socket) => {
    const newClientID = uuidv4();

    connectionArray.push({
      clientID: newClientID,
      socket,
    });

    // Send the new client its token; it send back a "username" message to
    // tell us what username they want to use.
    socket.emit('id', JSON.stringify({
      type: 'id',
      id: newClientID,
    }));

    Logger.log(`Connection accepted (id / ip): ${socket.id} / ${socket.handshake.url}`);
    Logger.log(`New CientID: ${newClientID}`);
  },

  // Return current value and then increment.
  // Initial value starts at zero.
  getAppendToMakeUnique: () => {
    appendToMakeUnique += 1;
    return appendToMakeUnique;
  },

  // Scan the list of connections and return the one for the specified
  // clientID. Each login gets an ID that doesn't change during the session,
  // so it can be tracked across username changes.
  getConnectionForID: (id) => {
    let retrievedSocket = null;

    for (let i = 0; i < connectionArray.length; i += 1) {
      if (connectionArray[i].clientID === id) {
        retrievedSocket = connectionArray[i].socket;
        break;
      }
    }
    return retrievedSocket;
  },

  // Scans the list of users and see if the specified name is unique. If it is,
  // return true. Otherwise, returns false. We want all users to have unique
  // names.
  isUsernameUnique: (name) => {
    let isUnique = true;

    for (let i = 0; i < connectionArray.length; i += 1) {
      if (connectionArray[i].username === name) {
        isUnique = false;
        break;
      }
    }
    return isUnique;
  },

  // Builds a message object of type "userlist" which contains the names of
  // all connected users. Used to ramp up newly logged-in users and,
  // inefficiently, to handle name change notifications.
  makeUserListMessage: () => {
    const userListMsg = {
      type: 'userlist',
      users: [],
    };

    // Add the users to the list
    for (let i = 0; i < connectionArray.length; i += 1) {
      userListMsg.users.push(connectionArray[i].username);
    }
    return userListMsg;
  },

  // Remove the disconnect from the list of connections.
  removeDisconnectedUser: () => {
    Logger.log(`ConnectionArray size before: ${connectionArray.length}`);
    Logger.log('Remove Disconnected User.');

    connectionArray = connectionArray.filter(el => el.connected);

    Logger.log(`ConnectionArray size after: ${connectionArray.length}`);
  },

  // Sends a message (which is already stringified JSON) to a single
  // user, given their username. We use this for the WebRTC signaling,
  // and we could use it for private text messaging.
  sendToOneUser: (target, msgString) => {
    for (let i = 0; i < connectionArray.length; i += 1) {
      if (connectionArray[i].username === target) {
        connectionArray[i].sendUTF(msgString);
        break;
      }
    }
  },

  // Sends a "userlist" message to all members
  // to ensure that every join/drop is reflected everywhere. It would be more
  // efficient to send simple join/drop messages to each user
  sendUserListToAll: (WebSocketServer) => {
    Logger.log('Send User List To All.');
    const userListMsgStr = JSON.stringify(UserController.makeUserListMessage());
    // Broadcast to all connected sockets
    WebSocketServer.emit('userlist', userListMsgStr);
  },

  setUserName: (clientID, name) => {
    for (let i = 0; i < connectionArray.length; i += 1) {
      if (connectionArray[i].clientID === clientID) {
        connectionArray[i].username = name;
        break;
      }
    }
  },

};

Object.freeze(UserController);

module.exports = UserController;
