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

        socket.on("keyPressed", function(Array: any) {
            Array.push(socket.id);
            this.keyHandler(Array);
        });

        socket.on("loop", function() {
            this.updateHandler(socket.id);
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

  getClientIndex(id:number){
    for(let i = 0; i < this.clients.length; i++){
      if(this.clients[i]['id'] == id){
        return i;
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

  keyHandler([keyName, eventType, socketId]:[string, string, number]){
    let keyState = (eventType == "keydown") ? true : false,
        clientIndex = this.getClientIndex(socketId),
        player = this.clients[clientIndex].player;

      switch(keyName) {

        case "ArrowLeft":// left key
              player.setLeft(keyState);
        break;
        case "ArrowUp":// up key
              player.setUp(keyState);
        break;
        case "ArrowRight":// right key
            player.setRight(keyState);
        break;
      }
  }

  updateHandler(socketId:number){
    let clientIndex = this.getClientIndex(socketId),
        player = this.clients[clientIndex].player;

    if (player.getUp() && !player.getJumping()) {

      player.addVelocityY(-40); //bestimmt Höhe des Sprungs
      player.setJumping(true);

    }

    if (player.getLeft()) {
      player.addVelocityX(-1.5);
    }

    if (player.getRight()) {

      player.addVelocityX(1.5);

    }

    player.addVelocityY(1.2);// gravity
    player.addCoordsX(player.getVelocityX);
    player.addCoordsY(player.getVelocityY);
    
    player.x_velocity *= 0.9;// friction
    player.y_velocity *= 0.9;// friction

    // if player is falling below floor line
    if (player.y > 640 - 80 - 120) {

      player.jumping = false;
      player.y = 640 - 80 - 120;
      player.y_velocity = 0;

    }

    // if player is going off the left of the screen
    if (player.x < -120) {

      player.x = 960;

    } else if (player.x > 960) {// if player goes past right boundary

      player.x = -120;

    }
  }

}
