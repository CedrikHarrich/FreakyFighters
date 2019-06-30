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
        this.http.listen(Const.PORT);

        //Enable server to listen to specific events.
        this.io = require('socket.io')(this.http);

        console.log(`The server has started and is now listening to the port: ${Const.PORT}`)

        //The server starts listening to events and sends packages as soon
        //as someone connects.
        this.registerConnection();
        this.init();
    }

    registerConnection() {
      //EventHandler: Connection of Client
      this.io.sockets.on('connection', (socket: any)=>{

        //Start with listening to reconnections.
        socket.on('reconnection', () => {
            console.log(`A Player from ${socket.id} is trying to reconnect...`);
            this.connectionHandler(socket);
        });

        //Decide whether to let a player connect or not. Handle the outcome.
        this.connectionHandler(socket);
      });

    }

    connectionHandler(socket: any){
      if (this.playerList.length < Const.MAX_CLIENTS || Const.UNLIMITED_PLAYERS){
          var player = this.addPlayerClient(socket);
          this.registerPlayerEvents(socket, player);
      } else {
          //Send the Client the event that he has to wait.
          socket.emit('wait', Const.WAITING_TIME);
          console.log(`Putting Player on with socket ID: "${socket.id}" into the queue.`);
        }
    }

    registerPlayerEvents(socket: any, player : any){
      //EventHandler: When a key is pressed do ...
      socket.on('keyPressed', (data: any) =>{
          this.keyPressedHandler(data, socket.id);
          console.log(`${data.inputId} has been pressed by player ${socket.id}.`);
      });

      socket.on('movingMouse', (data: any) => {
        player.setCursorPosition(data.cursor_X, data.cursor_Y);
      });

      //EventHandler: Disconnection of Client
      socket.on('disconnect', ()=>{
          this.removePlayerClient(socket.id);

          console.log(`The player with the ID ${socket.id} has disconnected.`);
          console.log(`There are ${this.playerList.length} Players left.`);
      });
    }

    init(){
      //Start the Update Loop FRAMES_PER_SECOND times per second.
      setInterval(()=>{
          //The gameState holds all the information the client
          //needs to draw the game
          var gameState : Array<any> = [];
          var actionState : Array<any> = []
          //GameStatePacker
          for(var i in this.playerList){
              var player = this.playerList[i];
              player.updatePosition();
              this.handleCollision(player, this.grid);
              this.handlePlayerColission(i, this.playerList);
              gameState.push({
                  x: player.getX(),
                  y: player.getY(),
                  cursor_X: player.getCursorX(),
                  cursor_Y: player.getCursorY(),
                  characterNumber: player.checkDirection(),
                  id: player.getId(),
                  isTakingAction: player.getIsTakingAction()
              });

              if(player.getIsTakingAction()){
                actionState.push({
                    player_ID : player.getId(),
                    action_X : player.getActionX(),
                    action_Y : player.getActionY()
                })
              }
          }


          //Event: Send Gamestate to the clients.
          for(var i in this.clientList){
              var socket = this.clientList[i];
              socket.emit('update', gameState, actionState);
          }
      }, 1000/Const.FRAMES_PER_SECOND);
    }

    handleCollision(player : Player, grid: any){
        //Check the grid for blocks.
        for (let i = 0; i < grid.length; i++){
            for (let j = 0; j < grid[i].length; j++){
                if(grid[i][j] === 1){
                    //Calculate the Coordinates of each Block (Left Upper Corner)
                    var blockPositionX = Const.BLOCK_WIDTH * j;
                    var blockPositionY = Const.BLOCK_HEIGHT * i;
                  
                    //Check if Players have collsions with blocks.
                    if (this.haveCollision(player, blockPositionX, blockPositionY)) {

                            //Handle Collisions accordingly
                            if (player.getVelocityY() >= 0 && player.getY() + Const.PLAYER_HEIGHT-Const.SETBACK < blockPositionY){
                                if (player.getIsDownKeyPressed() == false && Const.FALL_THROUGH_BLOCKS){
                                    player.setVelocityY(0);
                                    player.setY(blockPositionY - Const.PLAYER_HEIGHT);
                                    player.setIsJumping(false);
                                }
                            }
                        }
                }
            }
        }
    }

    handlePlayerColission(main : any, playerList : Player[]){
        var currentPlayer = playerList[main];
        for(var i in playerList){
            var otherPlayer = playerList[i];
            if (i !== main){
                if (this.havePlayerCollision(currentPlayer, otherPlayer)){
                    if(currentPlayer.getX() + Const.PLAYER_WIDTH > otherPlayer.getX() && currentPlayer.getVelocityX() > otherPlayer.getVelocityX() * (-1)){
                        console.log("Schubse!");
                        otherPlayer.setX(currentPlayer.getX() + Const.PLAYER_WIDTH);
                    } else if (currentPlayer.getX() + Const.PLAYER_WIDTH > otherPlayer.getX() && currentPlayer.getVelocityX() < otherPlayer.getVelocityX() * (-1)){
                        console.log("Schubse!");
                        currentPlayer.setX(otherPlayer.getX() - Const.PLAYER_WIDTH);
                    }
                }
            }
        }
    }

    havePlayerCollision(playerOne : Player, playerTwo : Player) : boolean {
        if (playerOne.getX() + Const.PLAYER_WIDTH > playerTwo.getX() + Const.PERMEABLE_EDGES &&
            playerOne.getX() + Const.PERMEABLE_EDGES < Const.BLOCK_WIDTH + playerTwo.getX() &&
            playerOne.getY() + Const.PLAYER_HEIGHT > playerTwo.getY() &&
            playerOne.getY() < Const.BLOCK_HEIGHT + playerTwo.getY())
        {
            console.log("Players are colliding");
            return true;
        } else {
            return false;
        }
    }

    haveCollision(player : Player, blockPositionX : number, blockPositionY :number) : boolean {
        if (player.getX() + Const.PLAYER_WIDTH > blockPositionX + Const.PERMEABLE_EDGES &&
            player.getX() + Const.PERMEABLE_EDGES < Const.BLOCK_WIDTH + blockPositionX &&
            player.getY() + Const.PLAYER_HEIGHT > blockPositionY &&
            player.getY() < Const.BLOCK_HEIGHT + blockPositionY)
        {
            return true;
        } else {
            return false;
        }
    }

    addPlayerClient(socket: any){
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

        return player;
    }

    removePlayerClient(socketId: any){
      //Ticketsystem: When a player disconnects we need to delete him from clients and players.
      //And we need to push his Id to the ID-Stack that the next player can take it.
      let playerId = this.getPlayerClientId(this.playerList, socketId),
          clientId = this.getPlayerClientId(this.clientList, socketId);

      this.clientList.splice(clientId, 1);
      this.playerList.splice(playerId, 1);
      this.idNumberStack.push(socketId);
    }

    getPlayerClientId(arr: Array<any>, socketId:any){
      // returns the index a player or client have, given their socketId
      for (let i = 0; i < arr.length; i++){
          if(arr[i].id == socketId){
              return i;
          }
      }
    }

    keyPressedHandler({inputId: inputId, state: state}:any, socketId:any){
      let playerId = this.getPlayerClientId(this.playerList, socketId),
          player = this.playerList[playerId];

      switch (inputId){
        case "ArrowUp":
            player.setIsUpKeyPressed(state);
            break;
        case "ArrowLeft":
            player.setIsLeftKeyPressed(state);
            break;
        case "ArrowDown":
            player.setIsDownKeyPressed(state);
            break;
        case "ArrowRight":
            player.setIsRightKeyPressed(state);
            break;
        case "a":
            if(player.getIsTakingAction() === false){
                console.log(`Player ${socketId} is shooting`);
                player.setIsTakingAction(state);
            };
            break;

          default:
              return;
      }
    }

}
