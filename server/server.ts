import * as express from 'express';
import * as path from 'path';
import { Player } from './Player';
import { GlobalConstants as Const } from '../global/GlobalConstants';

export class Server{
    //Variables for the connection
    private express:any;
    private app:any;
    private http:any;
    private io:any;
    private clientList : Array<any> = [];

    //Variables for the actual game.
    private playerList : Array<Player> = [];
    private idCounter : number = 1;
    private idNumberStack :any = [];
    private grid = Const.TEST_GRID_27x16;

    constructor(){
        //Initialize Variables used for the connection
        this.express = require('express');
        this.app = express();
        this.http = require('http').Server(this.app);

        //Send Files to the client.
        this.app.get('/', function(req:any,res:any){
            res.sendFile(path.join(__dirname, '../dist/index.html'));
        });

        this.app.use(
          express.static(path.join(__dirname, '../dist/'))
        );

        //Server starts listening.
        this.http.listen(3000);

        //Enable server to listen to specific events.
        this.io = require('socket.io')(this.http);

        console.log(`The server has started and is now listening to the port: ${Const.PORT}`)

        //The server starts listening to events and sends packages as soon
        //as someone connects.
        this.registerEvents();
        this.init();
    }

    registerEvents(){
      //EventHandler: Connection of Client
      this.io.sockets.on('connection', (socket:any)=>{

        //Start with listening to reconnections.
        socket.on('reconnection', () => {
            console.log(`A Player from ${socket.id} is trying to reconnect...`);
            this.connectionHandler(socket);
        });
        //Decide wheter to letting a player connect or not. Handle the outcome.
        this.connectionHandler(socket);
      });
    }

    connectionHandler(socket : any) {
        if(this.playerList.length < Const.MAX_CLIENTS || Const.UNLIMITED_PLAYERS){
            //Ticketsystem: If someone connects make a new Ticket. 
            if (this.idNumberStack.length == 0){
                this.idNumberStack.push(this.idCounter);
                this.idCounter ++;
            }
            //If a client connects. The socket will be registered and
            //the client gets a counting ID. ID = Position in Array.
            
            this.clientList.push(socket);
            socket.id = this.idNumberStack.pop();

            //A new player is created with the same ID as the socket.
            var player = new Player(socket.id);
            this.playerList.push(player);

            console.log(`The player with ID ${socket.id} has connected.`);

            //EventHandler: When a key is pressed do ...
            socket.on('keyPressed', (data:any) =>{
                console.log(`${data.inputId} has been pressed by player ${socket.id}.`);

                switch (data.inputId){
                    case "ArrowUp":
                        player.setIsUpKeyPressed(data.state);
                        break;
                    case "ArrowLeft":
                        player.setIsLeftKeyPressed(data.state);
                        break;
                    case "ArrowDown":
                        player.setIsDownKeyPressed(data.state);
                        break;
                    case "ArrowRight":
                        player.setIsRightKeyPressed(data.state);
                        break;

                    default:
                        return;
                }
            });

            //EventHandler: Disconnection of Client
            socket.on('disconnect', ()=>{
                //Ticketsystem: When a player disconnects we need to delete him from clients and players.
                //And we need to push his Id to the ID-Stack that the next player can take it.
                for (let i = 0; i < this.clientList.length; i++){
                    if(this.clientList[i].id == socket.id){
                        this.clientList.splice(i, 1);
                    }
                }
                for (let i = 0; i < this.playerList.length; i++){
                    if(this.playerList[i].getId() == socket.id){
                        this.playerList.splice(i, 1);
                        this.idNumberStack.push(socket.id);
                    }
                }

                console.log(`The player with the ID ${socket.id} has disconnected.`);
                console.log(`There are ${this.playerList.length} Players left.`);
            });
    } else {
        console.log(`Putting Player on with socket ID: "${socket.id}" into the queue.`);

        //Send the Client the event that he has to wait.
        socket.emit('wait', Const.WAITING_TIME);
    }
    }

    init(){
      //Start the Update Loop FRAMES_PER_SECOND times per second.
      setInterval(()=>{
          //The gameState holds all the information the client
          //needs to draw the game
          var gameState : Array<any> = [];

          //GameStatePacker
          for(var i in this.playerList){
              var player = this.playerList[i];
              player.updatePosition();
              this.handleCollision(player, this.grid);
              gameState.push({
                  x: player.getX(),
                  y: player.getY(),
                  characterNumber: player.checkDirection(),
                  id: player.getId()
              });

          }

          //Event: Send Gamestate to the clients.
          for(var i in this.clientList){
              var socket = this.clientList[i];
              socket.emit('update', gameState);
          }
      }, 1000/Const.FRAMES_PER_SECOND);
    }

    handleCollision(player : Player, grid: any){
        
        for (let i = 0; i < grid.length; i++){
            for (let j = 0; j < grid[i].length; j++){
                if(grid[i][j] === 1){
                    var blockPositionX = Const.BLOCK_WIDTH * j;
                    var blockPositionY = Const.BLOCK_HEIGHT * i;
                    var overlapping = 20;

                    //Check if Players have collsions with blocks.
                    //Overlapping: Since the arms of our creature are sticking out a lot.
                    //We wannt to let oure creature fall through the edge of the block.
                    if (player.getX() + Const.PLAYER_WIDTH > blockPositionX + overlapping &&
                        player.getX() + overlapping < Const.BLOCK_WIDTH + blockPositionX &&
                        player.getY() + Const.PLAYER_HEIGHT > blockPositionY &&
                        player.getY() < Const.BLOCK_HEIGHT + blockPositionY) {
                            //Hanlde Collisions accordingly
                            if (player.getVelocityY() >= 0){
                                player.setVelocityY(0);
                                player.setY(blockPositionY - Const.PLAYER_HEIGHT);
                                player.setIsJumping(false);
                                
                            }
                            if (player.getVelocityY() < 0){
                                player.setY(blockPositionY + Const.BLOCK_HEIGHT);
                                player.setVelocityY(0);
                            }
                        }
                }
            }
        }
    }
}
