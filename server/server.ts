import * as express from 'express';
import * as path from 'path';
import { Player } from './Player';

export class Server{
    //Variables for the connection
    private express:any;
    private app:any;
    private http:any;
    private io:any;
    private clientList : Array<any> = [];

    //Variables for the actual game.
    private playerList : Array<Player> = [];


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


        //EventHandler: Connection of Client
        this.io.sockets.on('connection', (socket:any)=>{
            //If a client connects. The socket will be registered and
            //the client gets a counting ID. ID = Position in Array.
            this.clientList.push(socket);
            socket.id = this.clientList.length;

            //A new player is created with the same ID as the socket.
            var player = new Player(socket.id);
            this.playerList.push(player);

            console.log(`The player with ID ${socket.id} has connected.`);

            socket.on('keyPressed', (data:any) =>{
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
                this.clientList.splice(socket.id - 1, socket.id);
                this.playerList.splice(socket.id - 1, socket.id);
                console.log(`The player with the ID ${socket.id} has disconnected.`);
                console.log(`There are ${this.playerList.length} Players left.`);
            });

        });

        //TODO: Start the Update Loop
        setInterval(()=>{
           //console.log('Updates are beeing sent');
           var gameState : Array<any> = [];
           //The Game State is being made here.
            for(var i in this.playerList){
                var player = this.playerList[i];
                player.updatePosition();
                gameState.push({
                    x: player.getX(),
                    y: player.getY(),
                    id: player.getId()
                });

            }
            //Event: Send Gamestate to the clients.
            for(var i in this.clientList){
                var socket = this.clientList[i];
                socket.emit('update', gameState);
            }
        }, 1000/60);
    }

}
