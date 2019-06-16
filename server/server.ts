import * as express from "express";
import * as path from "path";

import { GlobalConstants as Consts} from "./GlobalConstants";
import { Game } from "./Game";
import { Player } from "./Player";

export class Server {

  private app:any = express();
  private http:any;
  private io:any;
  private server:any;
  private socket: any;
  private users:number = 0;
  private port:number = 3000;
  private game:Game;
  private maxClients:number = 2;
  private isReady: boolean = false;  
  private clients: Array<any> = [];
  private readycounter : number = 0;

  //TODO: Needs to be changed to the data we need to send to the client.
  private gameData = {
    h1 : 100,
    h2 : "hello"
  }

  //When the game starts it should setup a server and
  //should start listening to all events that can occur.
  constructor(){
    this.init();
    this.registerEvents();
  }

  //Initialized the needed settings for setting up a server.
  //The server is now listening to the port set in GlobalConstants.
  init(){
    this.app.set("port", this.port);
    this.app.use(express.static('dist'));

    this.http = require("http").Server(this.app);
    this.io = require("socket.io")(this.http);

    console.log("A server has been created.");

    this.server = this.http.listen(this.port, () => {
        console.log(`The server is now listening on port *:" + ${this.port}.`);
    })
  }

  //The server starts registrating all the events that can occur.
  registerEvents(){
    //Event: Client connects to the server.
    this.io.on("connection", (socket: any) => {
        
        this.socket = socket;
        this.addClient(socket.id);
        console.log(`The user with ID ${socket.id} is trying to connect...`);

        this.userCountHandler();
        
        //Event: Client disconnects from the server.
        socket.on('disconnect', () => {
          this.readycounter = 0;
          console.log(`The player with the ID ${socket.id} has disconnected.`);
          this.removeClient(socket.id);
          this.userCountHandler();
        });

        //Event: When two clients are ready. Start the game.
        socket.on('ready', () => {
          this.readycounter ++;
          console.log(`There are ${this.readycounter} players ready to play.`)
          if (this.readycounter === Consts.maxClients){
            this.io.emit("gameStarts", this.game.getPlayers());
            
          }
        }); 

        //Event: Client sends a message.
        socket.on("message", function(message: any) {
            let newMessage = "Other Person: " + message;

            socket.broadcast.emit("message", newMessage);

            console.log(`The player ${socket.id} has sent the message '${message}'.`);
        });

        //Event: Client presses a key.
        socket.on("keyup", function(event: any) {
            console.log(`${socket.id} has pushed the '${event}' button.`);
            
        });
    });

  }

  setBackGame(){
    //Disconnect all the clients.
    for (let entry of this.clients){
      this.removeClient(entry.id);
      console.log(`${entry.id} has been kicked.`);
    }
    //Delete the old game.
    this.game = null;
    console.log(`The game has been set back. New players can join again.`);
  }

  addClient(id:number){
    this.clients.push({id: id, player: null});
  }

  removeClient(id:number){
    for(let i = 0; i < this.clients.length; i++){
      if(this.clients[i]['id'] == id){
        this.clients.splice(i, 1);
      }
    }
  }

  userCountHandler(){
    if(this.clients.length == this.maxClients){
      this.startGame();
    }
    else {
      this.game = null;

      if(this.clients.length < this.maxClients){
        // notifies specific client
        this.socket.emit("message", "Waiting for somebody to join");
      } else {
        // notifies all clients
        this.io.emit("message", "Too many Clients. Please sign off.");
      }
    }
    //console.log(this.clients);
  }

  //All the Assets are sent to the clients.
  sendGame(){

  }

  startGame(){
    //TODO: Initialize the game
    this.game = new Game();
    

    //needed?
    let players:[Player, Player] = this.game.getPlayers();

    if (players.length === this.clients.length){
      for(let i = 0; i < this.clients.length; i++){
          this.clients[i]['player'] = players[i];
      }
    }
    //TODO: send out the needed data to the players.
    this.io.emit("asset", this.gameData.h1);
    

    //Messages to Player and Console.
    this.io.emit("message", "Game has started.");
    console.log(`A new game has started.`);


    //TODO: Waiting for Ready Players. io.on("ready")...
    //TODO: 2x ready leads to event "go".
    //TODO: Start the update loop. Send out gamestate 60 times a second.
    //TODO: And listen for inputs and calculate them.
    //TODO: Handle how the inputs should be calculated. Logic of the game.
    //TODO: Check if there is a winnner. io.on("winner"); and handle it.
    //TODO: What do you do if someone disconnects?


    //Needed?
    

    //Needed? should eventually emit gamestate instead of players
    //this.io.emit("gameStarts", this.game.getPlayers());
  }

  updateGame(){

  }

}
