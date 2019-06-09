import * as express from "express";

const app = express();
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

let connectedClients : number = 0;

app.use(express.static('dist'))

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

    socket.on("keyup", function(event: any) {
        console.log(event);
    });
});

const server = http.listen(3000, function() {
    console.log("listening on *:3000");
})


//var connectedPlayers
//func starteSpiel wenn 2 Clients connected und sperre weitere Spieler

