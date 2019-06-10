//Import the required constants.
import { GlobalConstants } from "./GlobalConstants";
const port = GlobalConstants.port;

//Setting up the objects needed for socket.io and express.
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Counting the connected clients. If there are 2 Clients the game should start.
var connectedClients : number = 0;

//ClientHandling:

io.on("connection", function(socket: any) {
// ClientConnectionHandling:
    connectedClients ++;

    // Blocks new Clients from connecting if there are already two connected.
    if(connectedClients <=2){
        console.log("A user connected: " + connectedClients + ".");
        if (connectedClients == 2) {
            // TODO:
            // send datapackage to the clients.
            //io.emit("sendData", datapackage);
        }
    } else {
        console.log("More than 2 players!");
        socket.emit('serverFull', {}); 
        socket.disconnect();
        connectedClients --;
    }

    //Handles disconnection from a client.
    socket.on('disconnect', function() {
        connectedClients --;
        console.log('Got disconnect: ' + connectedClients + ".");
    });

// ClientInputHandling:
    // TODO:
    // 1. Handle pressed keys. If a key was pushed update the state accordingly.


// MessengerInputHandling:
    // TODO:
    // 1. Handle the interaction between messaging and playing.
    // e.g. Writing 'w' into the chat won't move my character.
    socket.on("message", function(message: any) {
        console.log(message);
        let newMessage = "Other Person: " + message;

        socket.broadcast.emit("message", newMessage);

    });

    
    
});

//ClientListener:
const server = http.listen(port, function() {
    console.log(`Server is listening on Port *: ${port}.`);
})


function sendData (){

}


// Connection Handling:
    // TODO : 
    // CHECK 1. Whenever two players have connected block everyone else.
    // 2. Send Information/Data to the clients.
    // 3. Wait for Ready Response
    // 4. Start Game when ready.
    // 5. Handle a sudden disconnect from one player and other errors.

// GameHandling:
    // TODO: 
    // 1. Implement a GameLoop for rendering the playground.
    // 2. Recalculate the state of the game 30-60 times per second.
    // 3. Get the inputs from the players.
    // 4. Setup the game Logic.
    

