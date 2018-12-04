const express = require('express');
const app = express();
const path = require('path');

const server = require('http').Server(app);
const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, './../client')));

app.use('/css', express.static(__dirname + './client/css'));
app.use('/js', express.static(__dirname + './client/js'));
app.use('/img', express.static(__dirname + './client/img'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

server.listen(3000);

const Rooms = {

  list: [],
  availableRoom: '',


  isRoomAvailable: () => {
    console.log(Rooms.availableRoom !== '')
    return Rooms.availableRoom !== ''
  },

  newRoom: ({id}) => {
    // roomId will be the socket.id passed in
    Rooms.availableRoom = id;
    // set new roomId save to Rooms.list
    console.log(Rooms)
    Rooms.list.push(id)
    // return roomId, player1
  },

  joinRoom: (socket) => {
    // get roomId from Rooms.list
    socket.join(Rooms.availableRoom)
    // return roomId, player2
    let roomId = Rooms.availableRoom
    Rooms.availableRoom = ''
    return roomId
  }
}; // Current rooms


io.on('connection', (socket) => {
  console.log("socket connection")
  console.log(socket.id)

  socket.on('isRoomAvailable', () => {
    let roomId = ''
    console.log("Rooms.isRoomAvailable()", Rooms.isRoomAvailable())
    if(Rooms.isRoomAvailable()) {

      roomId = Rooms.joinRoom(socket)
      socket.emit('startRoom',{roomId});
    }else{
      roomId = Rooms.newRoom(socket)
      socket.emit('awaitRoom',roomId);
    }
    console.log(Rooms)
  });

  socket.on('joiningRoom', ({roomId}) => {
    console.log ("partner joining you on server")
    console.log(roomId)
    socket.to(roomId).emit('joiningRoom', {roomId});
  });

  socket.on('app', (data) => {
    console.log ("partner draw message")
    console.log(data)
    socket.to(roomId).emit('app', data);
  });

});

// for authentication later: https://socket.io/docs/client-api/#With-query-parameters


function isRoomAvaiable(){
  // check if Room is available (player 1 already connected) or
  // return new room id and wait message
  // socket.emit('allplayers',getAllPlayers());
  // awaitRoom', function(data){
  //   Room.awaitRoom(data.roomId, data.id)
  //   socket.broadcast.emit('isRoomAvailable',socket.player);
}

// 

function getAllPlayers(){
  var players = [];
  Object.keys(io.sockets.connected).forEach(function(socketID){
    var player = io.sockets.connected[socketID].player;
    if(player) players.push(player);
  });
  return players;
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
