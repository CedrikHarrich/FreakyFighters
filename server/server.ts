//Setting up the objects needed for socket.io and express.
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectedClients : number = 0;

//app.use(express.static('dist'))

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
    // count up connectedClients
    connectedClients ++;
    console.log("A user connected" + connectedClients);
    
    // whenever a client disconnects count down connected Clients
    socket.on('disconnect', function() {
        connectedClients --;
        console.log('Got disconnect!' + connectedClients);
    });

    // whenever we receive a 'message' we log it out
    socket.on("message", function(message: any) {
        console.log(message);
        let newMessage = "Other Person: " + message;

        socket.broadcast.emit("message", newMessage);

    });

    
});

const server = http.listen(3000, function() {
    console.log("listening on *:3000");
})


//var connectedPlayers
//func starteSpiel wenn 2 Clients connected und sperre weitere Spieler

