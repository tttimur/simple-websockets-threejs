var express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'))

var connectedPeers = []

io.on('connection', function(socket){
  socket.on('userjoin', color => {
    socket.color = color
    connectedPeers.push(socket)

    socket.broadcast.emit('userjoined', {
      id: socket.id,
      color: socket.color
    })
  })

  socket.on('position', position => {
    console.log(position, socket.id)
    io.emit('positionReceived', {
      position, id: socket.id
    })
  })

  socket.on('disconnect', function () {
    connectedPeers = connectedPeers.filter(el => el.id !== socket.id)

    socket.broadcast.emit('userleft', {
      id: socket.id
    })
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});