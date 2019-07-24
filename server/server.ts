// TODO: seperate gamelogic from connection stuff

import * as express from 'express';
import * as path from 'path';
import { Player } from './Player';
import { clientList } from './clientList';
import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Keys } from '../global/Keys';
import { GameState } from '../global/GameState';
import { PlayerState } from "../global/PlayerState";
import { ShootActionState } from "../global/ShootActionState";
import { CollisionDetection } from './CollisionDetection';

export class Server{
    //Variables for the connection
    private express: any;
    private app: any;
    private http: any;
    private io: any;
    private clientList: clientList = [];

    //Variables for the actual game
    private idCounter: number = 1;
    private idNumberStack: Array<number> = [];
    private gameState: GameState;

    constructor(){
        this.setupServer();
        this.serveFiles();

        //The server starts listening to events and sends packages as soon as someone connects
        this.registerConnection();
        this.init();
    }

    setupServer(){
      //Initialize variables used for the connection
      this.express = require('express');
      this.app = express();
      this.http = require('http').Server(this.app);

      //Server starts listening
      this.http.listen(Const.PORT);
      console.log(`The server has started and is now listening to the port: ${Const.PORT}`)

      //Enable server to listen to specific events
      this.io = require('socket.io')(this.http);
    }

    serveFiles(){
      //Send files to the client
      this.app.get('/', function(req: any, res: any){
          res.sendFile(path.join(__dirname, '../dist/index.html'));
      });

      this.app.use(
        express.static(path.join(__dirname, '../dist/'))
      );
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

      //Eventhandler: When mouse is clicked...
      socket.on('mouseClicked', (data: any) => {
        this.mouseButtonPressedHandler(data, socket.id);
        console.log(`${data.button} has been pressed by player ${socket.id}.`);
      });

      //EventHandler: Disconnection of client
      socket.on('disconnect', ()=>{
        //Client is removed
        this.removeClient(socket.id);

        //The game is getting resetted
        this.resetGame();

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

          //GameStatePacker
          for(var i in this.clientList){
            var player = this.clientList[i].player;
            this.updatePlayerStates(player, i);
          }

          if(this.twoClientsAreConnected()){
            this.startGame();
            this.handleTimer();
            this.setWinnerIdAfterTimeUp();
            this.setWinnerIdAfterNoHealthPoints();
          } else {
            this.gameState.setWinnerId(Const.WINNER_INITIAL_STATE);
            this.gameState.setGameOver(true);
          }

          //Event: Send gameState to the clients.
          for(var i in this.clientList){
              var socket = this.clientList[i].socket;
              socket.emit('update', this.gameState);
          }

          //The array with the player information will be deleted after it was sent
          this.gameState.resetPlayerStates();

      }, 1000/Const.CALCULATIONS_PER_SECOND);
    }
    
    updatePlayerStates(player: Player, currentPlayerIndex: string){
      player.updatePlayerState();
          
      let shootActionState = this.makeShootActionState(player);

      CollisionDetection.handlePlayerCollision(currentPlayerIndex, this.clientList);
      CollisionDetection.handleShootObjectCollision(currentPlayerIndex, this.clientList);

      let playerState = this.makePlayerState(player, shootActionState);
      this.gameState.addPlayerState(playerState);
      player.setWasProtected(false);
      player.setWasHit(false);
    }
    
    makeShootActionState(player: Player){
      var shootActionState: ShootActionState;
      if(player.getIsShooting()){
        shootActionState = new ShootActionState({x: player.getShootActionX(), y: player.getShootActionY()});
      } else {
        shootActionState = new ShootActionState({x: 0, y: 0});
      }

      return shootActionState;
    }

    makePlayerState(player: Player, shootActionState: ShootActionState){
      var playerState = new PlayerState({
        x: player.getX(),
        y: player.getY(),
        cursorX: player.getCursorX(),
        cursorY: player.getCursorY(),
        clippingPosition: player.checkLookingDirection(),
        id: player.getId(),
        isInTheAir: player.getIsInTheAir(),
        healthPoints: player.getHealthPoints(),
        wasProtected: player.getWasProtected(),
        wasHit: player.getWasHit(),
        isShooting: player.getIsShooting(),
        isDefending: player.getIsDefending(),
        shootActionState: shootActionState
      });

      return playerState;
    }

    //starts timer and calculate remaining time
    handleTimer() {
      if (this.gameState.getGameOver() === false) {
        if (this.gameState.getTimerStarted() === false) {
          this.gameState.startTimer();
        }
        console.log(this.gameState.getTimeLeft());
        this.gameState.calculateTimeLeft();
      }
    }

    //Game starts when both players are ready
    startGame(){
      let player1 = this.clientList[0].player,
          player2 =  this.clientList[1].player;

      if(player1.getIsReadyToStartGame() && player2.getIsReadyToStartGame()){
        this.gameState.setGameOver(false);
        player1.resetPlayer();
        player2.resetPlayer();
      }
    }

    //reset game to initial state
    resetGame(){
      if(this.clientList.length !== 0){
        for (var i in this.clientList){
          this.clientList[i].player.resetPlayer();
        }
      }
      this.gameState.resetGameState();
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

      if(!this.gameState.getGameOver() && !this.gameState.winnerIsCalculated()){
        switch(button){
          case Keys.AttackMouse:
              this.setPlayerAttack(player, state);
            break;
          case Keys.DefenseMouse:
              this.setPlayerDefense(player, state);
              break;
          default:
            return;
        }
      }
    }

    keyPressedHandler({inputId: inputId, state: state}:{inputId: string, state: boolean}, socketId:number){
      let clientId = this.getClientId(socketId),
          player = this.clientList[clientId].player;

      if(inputId === Keys.Start){
        if(this.gameState.getGameOver()){
          this.setPlayerGameStartReady(player, socketId, true);
        } else {
          this.playAgain()
        }
      }

      if(!this.gameState.getGameOver() && !this.gameState.winnerIsCalculated()){
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
              this.setPlayerAttack(player, state);
              break;
          case Keys.Defense:
              this.setPlayerDefense(player, state);
              break;
          default:
                return;
        }
      }
    }

    playAgain(){
      if(this.gameState.winnerIsCalculated()){
        this.resetGame();
      }
    }

    setPlayerGameStartReady(player: Player, socketId: number, isReady: boolean){
      player.setIsReadyToStartGame(isReady);
      this.gameState.playersInGame[socketId] = isReady;
      console.log(`Players in game: ${this.gameState.playersInGame} SocketID: ${socketId}`)
      console.log(`The game should be starting now! GameOver: ${this.gameState.getGameOver()}`);
    }

    setPlayerDefense(player: Player, state: boolean){
      if(!player.getIsShooting() && state === true){
        player.setIsDefending(true)
      }

      if(player.getIsDefending() && !state){
        player.setIsDefending(false);
      }
    }

    setPlayerAttack(player: Player, state: boolean){
      if(!player.getIsDefending() && !player.getIsShooting()){
        player.setShootAction(state);
      }
    }

    //check if two clients are connected in order to play the game
    twoClientsAreConnected(){
      return (this.clientList.length === 2);
    }

    //if one of the players has no healthpoints left the winner is calculated and setted
    setWinnerIdAfterNoHealthPoints(){
      const player1 = this.gameState.playerStates[0];
      const player2 = this.gameState.playerStates[1];

      if(player1.getHealthPoints() <= 0 || (player2.getHealthPoints() <= 0)){
        if (player1.getHealthPoints() > player2.getHealthPoints()){
          this.gameState.setWinnerId(player1.getId());

        } else {
          this.gameState.setWinnerId(player2.getId());
        }
      }
    }

    //after given time is up the winner is calculated and setted
    setWinnerIdAfterTimeUp(){
      if (this.gameState.timeLeft === 0 && !this.gameState.getGameOver()){
        const player1 = this.gameState.playerStates[0];
        const player2 = this.gameState.playerStates[1];
        let winnerId: number;

        if (player1.getHealthPoints() > player2.getHealthPoints()){
          winnerId = player1.getId();
        }
        if (player1.getHealthPoints() < player2.getHealthPoints()){
          winnerId = player2.getId();
        }
        if(player1.getHealthPoints() === player2.getHealthPoints()){
          winnerId = Const.GAMEOVER_DRAW;
        }
        this.gameState.setWinnerId(winnerId);
      }
    }
  }
