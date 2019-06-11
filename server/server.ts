import * as express from "express";
import * as path from "path";

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
  private Game:Game;
  private maxClients:number = 2;
  private isReady: boolean = false;
  private clients: Array<any> = [];

  constructor(){
    this.init()
    this.registerEvents();
  }

  init(){
    this.app.set("port", this.port);
    this.app.use(express.static('dist'));

    this.http = require("http").Server(this.app);
    this.io = require("socket.io")(this.http);

    this.server = this.http.listen(this.port, () => {
        console.log("listening on *:" + this.port);
    })
  }

  registerEvents(){
    this.io.on("connection", (socket: any) => {

        this.socket = socket;
        this.addClient(socket.id);

        console.log("a user connected");

        this.userCountHandler();

        socket.on('disconnect', () => {
          console.log('disconnected');
          this.removeClient(socket.id);
          this.userCountHandler();
        });

        socket.on("message", function(message: any) {
            let newMessage = "Other Person: " + message;

            socket.broadcast.emit("message", newMessage);
        });

        socket.on("keyup", function(event: any) {
            console.log(event);
        });
    })
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
      console.log('new games')
    }
    else {
      this.Game = null;

      if(this.clients.length < this.maxClients){
        // notifies specific client
        this.socket.emit("message", "Waiting for somebody to join");
      } else {
        // notifies all clients
        this.io.emit("message", "Too many Clients. Please sign off.");
      }
    }
    console.log(this.clients);
  }

  sendGame(){

  }

  startGame(){
    this.Game = new Game();
    let players:[Player, Player] = this.Game.getPlayers();

    if (players.length === this.clients.length){
      for(let i = 0; i < this.clients.length; i++){
          this.clients[i]['player'] = players[i];
      }
    }

    // should eventually emit gamestate instead of players
    this.io.emit("gameStarts", this.Game.getPlayers());
  }

  updateGame(){

  }

}
