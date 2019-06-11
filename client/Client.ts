import * as io from "socket.io-client";
import { Player } from "../server/Player";

export class Client {

  private socket: SocketIOClient.Socket;
  private form: HTMLElement;
  private input: HTMLInputElement;
  private textContainer: HTMLElement;
  private gridSize:number = 30; // height and width in px
  private grid: Array<any>;
  private canvasID: string = "myCanvas";
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private players: [Player, Player];

  constructor(){
    this.socket = io("http://localhost:3000");
    this.form = document.getElementById("messenger");
    this.input = <HTMLInputElement>document.getElementById("input");
    this.textContainer = document.getElementById("textContainer");
    this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasID);
    this.context = this.canvas.getContext('2d');

    this.registerEvents();
  }

   registerEvents(){
    // any data that is recieved from the socket will be printed
    this.socket.on("message", (data:any) => {
      this.logMsg(data);
    });

    this.socket.on("gameStarts", (players:[Player, Player]) => {
      console.log("game starts");
      this.players = players;
      this.draw();
    });

    // text that is submited through the input will be sent to the server
    this.form.addEventListener('submit', this.sendMsg.bind(this));

    // name of pressed keys are sent to the server
    document.addEventListener('keyup', this.keyupHandler.bind(this));
  }

  sendMsg(e:any) {
      e.preventDefault();
      this.socket.emit("message", this.input.value);
      this.logMsg(this.input.value);
      this.input.value = null;
  }

  logMsg(text:any){
    let textNode = document.createElement("p");
    textNode.innerHTML = text;
    this.textContainer.appendChild(textNode);
  }

  keyupHandler(event:any){
    this.socket.emit("keyup", event.key);
  }

  draw(){
    this.drawGrid();
    this.drawPlayers();
  }

  drawPlayers(){
    for(let i = 0; i < this.players.length; i++){
      let player = <Player>this.players[i];
    }
  }

  drawGrid(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for(let i=1; i<this.canvas.height; i++){
        this.drawLine(0, i*this.gridSize, this.canvas.width, i*this.gridSize);
    }

    for(let i=1; i<this.canvas.width; i++){
        this.drawLine(i*this.gridSize, 0, i*this.gridSize, this.canvas.height);
    }
  }

  drawLine(x1:number, y1:number, x2:number, y2:number) {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

}
