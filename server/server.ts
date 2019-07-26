import * as express from 'express';
import * as path from 'path';
import { Player } from './Player';
import { clientList } from './clientList';
import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Keys, Events } from '../global/Enums';
import { GameState } from '../global/GameState';
import { GameEventHandler } from './GameEventHandler';
import { GameHandler } from './GameHandler';

export class Server{
    //Variables for the connection
    private express: any;
    private app: any;
    private http: any;
    private io: any;
    private clientList: clientList = [];
    private gameEventHandler: GameEventHandler;
    private gameHandler: GameHandler;

    //Variables for the actual game
    private idCounter: number = 1;
    private idNumberStack: Array<number> = [];
    private gameState: GameState;

    constructor(){
        this.setupServer();
        this.serveFiles();
        this.gameState = new GameState();
        this.gameHandler = new GameHandler(this.clientList, this.gameState);
        this.gameEventHandler = new GameEventHandler(this.gameHandler, this.gameState);
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
      console.log(`The server has started and is now listening to the port: ${Const.PORT}`);
      console.log(`Please click: --> ${Const.SERVER_URL} <--`);

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
      this.io.sockets.on(Events.Connection, (socket: any)=>{

        //Start with listening to reconnections
        socket.on(Events.Reconnection, () => {
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
          socket.emit(Events.Wait, Const.WAITING_TIME);
          console.log(`Putting Player on with socket ID: "${socket.id}" into the queue.`);
        }
    }

    //start listening to all the events when connected
    registerPlayerEvents({player, socket} : {player: Player, socket: any}){
      //EventHandler: When a key is pressed do ...
      socket.on(Events.KeyPressed, (data: any) => {
          this.keyPressedHandler(data, socket.id);
      });

      //EventHandler: When mouse is moved ...
      socket.on(Events.MovingMouse, (data: any) => {
          this.mouseMoveHandler(data, socket.id);
      });

      //Eventhandler: When mouse is clicked...
      socket.on(Events.MouseClicked, (data: any) => {
          this.mouseButtonPressedHandler(data, socket.id);
      });

      //EventHandler: Disconnection of client
      socket.on(Events.Disconnect, ()=>{
          //Client is removed
          this.removeClient(socket.id);

          //The game is getting resetted
          this.gameHandler.resetGame();

          console.log(`The player with the ID ${socket.id} has disconnected.`);
          console.log(`There are ${this.clientList.length} Players left.`);
      });
    }

    //Starts the LOOP on the server that is calculating the logic
    init(){

      //Start the Update Loop CALCULATIONS_PER_SECOND times per second
      setInterval(()=>{

          //pack updated players as playerStates into gamestate
          this.gameHandler.packPlayerStates()

          //calculate all gameState variables
          this.gameHandler.calculateGameState();

          //Event: Send updated gameState to the clients.
          for(var i in this.clientList){
              var socket = this.clientList[i].socket;
              socket.emit(Events.Update, this.gameState);
          }

          //The array with the player information will be deleted after it was sent
          this.gameState.resetPlayerStates();

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
        socket.emit(Events.ID, socket.id);

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

    //handle moving mouse event
    mouseMoveHandler(data: any, socketId: number){
      let clientId = this.getClientId(socketId),
          player = this.clientList[clientId].player;

      this.gameEventHandler.handleCursorTarget(player, data);
    }

    //handle mouse button pressed/clicked event
    mouseButtonPressedHandler({button: button, state: state}:{button: number, state: boolean}, socketId:number){
      let clientId = this.getClientId(socketId),
          player = this.clientList[clientId].player;

      this.gameEventHandler.handlePlayerActionMouse(button, player, state);
    }

    //handle key pressed event
    keyPressedHandler({inputId: inputId, state: state}:{inputId: string, state: boolean}, socketId:number){
      let clientId = this.getClientId(socketId),
          player = this.clientList[clientId].player;

      if(inputId === Keys.Start){
        this.gameEventHandler.handleStartKey(player, socketId);
      } else {
        this.gameEventHandler.handlePlayerActionKeys(inputId, player, state);
      }
    }

  }
