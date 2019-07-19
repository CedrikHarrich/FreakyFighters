import * as express from 'express';
import * as path from 'path';
import { Player } from './Player';
import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Keys } from '../global/Keys';
import { GameState, PlayerState, ActionState } from '../global/GameState';
import { CollisionDetection } from './CollisionDetection'

export class Server{
    //Variables for the connection
    private express: any;
    private app: any;
    private http: any;
    private io: any;
    private clientList: Array<{'player': Player, 'socket': any}> = [];

    //Variables for the actual game
    private idCounter: number = 1;
    private idNumberStack: Array<number> = [];
    private gameState: GameState;

    constructor(){
        //Initialize variables used for the connection
        this.express = require('express');
        this.app = express();
        this.http = require('http').Server(this.app);

        //Send files to the client
        this.app.get('/', function(req: any, res: any){
            res.sendFile(path.join(__dirname, '../dist/index.html'));
        });

        this.app.use(
          express.static(path.join(__dirname, '../dist/'))
        );

        //Server starts listening
        this.http.listen(Const.PORT);

        //Enable server to listen to specific events
        this.io = require('socket.io')(this.http);

        console.log(`The server has started and is now listening to the port: ${Const.PORT}`)

        //The server starts listening to events and sends packages as soon as someone connects
        this.registerConnection();
        this.init();
    }

    registerConnection() {
      //EventHandler: Connection of client
      this.io.sockets.on('connection', (socket: any)=>{

        //Start with listening to reconnections
        socket.on('reconnection', () => {
            console.log(`A Player from ${socket.id} is trying to reconnect...`);
            this.connectionHandler(socket);
        });

        //Decide whether to let a player connect or not. Handle the outcome.
        this.connectionHandler(socket);
      });

    }

    //Handle everything needed when a client connects
    connectionHandler(socket: any){
      //Check if the game needs another player
      if (this.clientList.length < Const.MAX_PLAYERS || Const.UNLIMITED_PLAYERS){
          var client = this.addClient(socket);
          this.registerPlayerEvents(client);

      } else {
          //Otherwise notify client that he has to wait.
          socket.emit('wait', Const.WAITING_TIME);
          console.log(`Putting Player on with socket ID: "${socket.id}" into the queue.`);
        }
    }

    //start listening to all the events when connected
    registerPlayerEvents({player, socket} : {player: Player, socket: any}){
      //EventHandler: When a key is pressed do ...
      socket.on('keyPressed', (data: any) => {
          this.keyPressedHandler(data, socket.id);
          console.log(`${data.inputId} has been pressed by player ${socket.id}.`);
      });

      //EventHandler: When mouse is moved ...
      socket.on('movingMouse', (data: any) => {
        player.setCursorPosition(data.cursorX, data.cursorY);
      });

      socket.on('buttonClicked', (data: any) => {
        this.mouseButtonPressedHandler(data, socket.id);
        console.log(`${data.button} has been pressed by player ${socket.id}.`);
      });

      //EventHandler: Disconnection of client
      socket.on('disconnect', ()=>{
        //Client is removed
        this.removeClient(socket.id);

        //The game is getting resetted
        this.gameState.timeLeft = Const.COUNTDOWN;
        this.gameState.timerStarted = false;

        console.log(`The player with the ID ${socket.id} has disconnected.`);
        console.log(`There are ${this.clientList.length} Players left.`);
      });
    }

    //Starts the LOOP on the server that is calculating the logic
    init(){

      //The gameState that collects all the information for the client
      this.gameState = new GameState();

      //Start the Update Loop CALCULATIONS_PER_SECOND times per second

      setInterval(()=>{
        //Stop calculating if the game has already been won or time is up

        if ((this.gameState.getWinner() > 0) ){
          if( this.clientList.length >= 2){
            for(var i in this.clientList){
              var socket = this.clientList[i].socket;
              socket.emit('end', this.gameState.getWinner());
            }
          } else {
            this.gameState.setWinner(Const.INITIAL_STATE);
            this.gameState.setGameOver(true);
          }

        } else {
          //GameStatePacker
          for(var i in this.clientList){

            //Timer: starts when 2 Players are in the lobby.
            if(this.twoClientsAreConnected()){

              if(this.gameState.getGameOver() === false){
                if(this.gameState.getTimerStarted() === false){
                  this.clientList[i].player.setHealthPoints(Const.MAX_HP);
                  this.gameState.startTimer();
                }
                console.log(this.gameState.getTimeLeft());
                this.gameState.calculateTimeLeft();
              }
            } 

            var player = this.clientList[i].player;
            player.updatePlayerState();

              if(player.getIsTakingAction()){
                var actionState: ActionState = new ActionState({x: player.getActionX(), y: player.getActionY()});
              } else {
                var actionState: ActionState = new ActionState({x: 0, y: 0});
              }

            CollisionDetection.handlePlayerCollision(i, this.clientList);
            CollisionDetection.handleShootObjectCollision(i, this.clientList);

            let playerState = new PlayerState({
                x: player.getX(),
                y: player.getY(),
                cursorX: player.getCursorX(),
                cursorY: player.getCursorY(),
                clippingPosition: player.checkLookingDirection(),
                id: player.getId(),
                healthPoints: player.getHealthPoints(),
                wasProtected: player.getWasProtected(),
                wasHit: player.getWasHit(),
                isTakingAction: player.getIsTakingAction(),
                isDefending: player.getIsDefending(),
                actionState: actionState
            })

            this.gameState.addPlayerState(playerState);
            this.clientList[i].player.setWasProtected(false);
            this.clientList[i].player.setWasHit(false);
            this.gameState.playersInGame[i] = this.clientList[i].player.getIsReadyToStartGame();
          }


          if(this.twoClientsAreConnected()){
            if(this.clientList[0].player.getIsReadyToStartGame() && this.clientList[1].player.getIsReadyToStartGame()){
              this.gameState.setGameOver(false);
            }
          }


          //Event: Send gameState to the clients.
          for(var i in this.clientList){
              var socket = this.clientList[i].socket;
              socket.emit('update', this.gameState);
          }

          //Winner calculated after time run out
          this.setWinnerAfterTimeUp();

          //Winner calculated after one player has no healthPoints
          this.setWinnerAfterNoHealthPoints();

          //The array with the player information will be deleted after it was sent
          this.gameState.resetPlayerStates();
        }
      }, 1000/Const.CALCULATIONS_PER_SECOND);
    }

    

    addClient(socket: any){
      let clientIndex = this.clientList.length;

        //Ticketsystem: If someone connects make a new ticket.
        if (this.idNumberStack.length == 0){
            this.idNumberStack.push(this.idCounter);
            this.idCounter ++;
        }

        //If a client connects, the socket will be registered and
        //the client gets a counting ID. ID = Position in Array
        socket.id = this.idNumberStack.pop();
        socket.emit('ID', socket.id);

        //A new player is created with the same ID as the socket
        var player = new Player(socket.id);

        this.clientList.push({'player': player, 'socket': socket})

        console.log(`The player with ID ${socket.id} has connected.`);

        return this.clientList[clientIndex];
    }

    removeClient(socketId: number){
      //Ticketsystem: When a player disconnects, he needs to be deleted from clients and players.
      //His ID needs to be pushed the ID-Stack so that the next player can take it
      let clientId = this.getClientId(socketId);

      this.clientList.splice(clientId, 1);
      this.idNumberStack.push(socketId);
    }

    getClientId(socketId: number){
      // Returns the index of a player or client, given their socketID
      for (let i = 0; i < this.clientList.length; i++){
          if(this.clientList[i].socket.id == socketId){
              return i;
          }
      }
    }

    mouseButtonPressedHandler({button: button, state: state}:{button: number, state: boolean}, socketId:number){
      let clientId = this.getClientId(socketId),
          player = this.clientList[clientId].player;

      switch(button){
        case Keys.AttackMouse:
            if(player.getIsTakingAction() === false){
              console.log(`Player ${socketId} is shooting`);
              player.setIsTakingAction(state);
          };
          break;
        case Keys.DefenseMouse:
            player.setIsDefending(state);
            break;
        default:
          return;
      }
    }

    keyPressedHandler({inputId: inputId, state: state}:{inputId: string, state: boolean}, socketId:number){
      let clientId = this.getClientId(socketId),
          player = this.clientList[clientId].player;
      if(inputId === Keys.Start){
        if(this.gameState.getGameOver()){
          player.setIsReadyToStartGame(true);
          this.gameState.playersInGame[socketId-1] = true;
          console.log(`Players in game: ${this.gameState.playersInGame} SocketID: ${socketId}`)
          console.log(`The game should be starting now! GameOver: ${this.gameState.getGameOver()}`);
        }
      }

      if(!this.gameState.getGameOver()){
        switch (inputId){
          case Keys.Up:
              player.setIsUpKeyPressed(state);
              break;
          case Keys.Left:
              player.setIsLeftKeyPressed(state);
              break;
          case Keys.Down:
              player.setIsDownKeyPressed(state);
              break;
          case Keys.Right:
              player.setIsRightKeyPressed(state);
              break;
          case Keys.Attack:
              if(player.getIsTakingAction() === false){
                  console.log(`Player ${socketId} is shooting`);
                  player.setIsTakingAction(state);
              };
              break;
          case Keys.Defense:
              player.setIsDefending(state);
              break;
            default:
                return;
        }
      }
      
    }

    twoClientsAreConnected(){
      return (this.clientList.length === 2);
    }

    //if one of the players has no healthpoints left the winner is calculated and setted
    setWinnerAfterNoHealthPoints(){
      if(this.twoClientsAreConnected()){
        if(this.gameState.playerStates[0].getHealthPoints() <= 0 || (this.gameState.playerStates[1].getHealthPoints() <= 0)){
          if (this.gameState.playerStates[0].getHealthPoints() > this.gameState.playerStates[1].getHealthPoints()){
            this.gameState.setWinner(this.gameState.playerStates[0].getId());

          } else {
            this.gameState.setWinner(this.gameState.playerStates[1].getId());
          }
        }
      }
    }

    //after given time is up the winner is calculated and setted
    setWinnerAfterTimeUp(){
      if(this.gameState.timeLeft === 0 && this.twoClientsAreConnected() && !this.gameState.getGameOver()){
        if (this.gameState.playerStates[0].getHealthPoints() > this.gameState.playerStates[1].getHealthPoints()){
          this.gameState.setWinner(this.gameState.playerStates[0].getId());
        } else {
          this.gameState.setWinner(this.gameState.playerStates[1].getId());
        }
      }
    }
}
