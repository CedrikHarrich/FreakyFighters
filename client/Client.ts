import * as io from "socket.io-client";
import { Player } from "../server/Player";
import { GlobalConstants as CONST } from "../server/GlobalConstants";

export class Client {

  private socket: SocketIOClient.Socket;
  private form: HTMLElement;
  private input: HTMLInputElement;
  private textContainer: HTMLElement;
  
  //private grid: Array<any>;
  private canvasID: string = "myCanvas";
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  // private players: [Player, Player];
  private playerX: number;
  private playerY: number;
  private players: object;
  private player: object;
  private playerImage: any = new Image();
  private backgroundImage: any = new Image();

  constructor(){
    this.socket = io(CONST.SERVER_URL);
    this.form = document.getElementById("messenger");
    this.input = <HTMLInputElement>document.getElementById("input");
    this.textContainer = document.getElementById("textContainer");
    this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasID);
    this.context = this.canvas.getContext('2d');

    this.registerEvents();
    this.loadImages();
  }

   registerEvents(){
    // any data that is recieved from the socket will be printed
    this.socket.on("message", (data:any) => {
      this.logMsg(data);
    });

    this.socket.on("gameStarts", (data:{'x':number, 'y':number}) => {
      console.log("game starts");
      this.playerX = data.x;
      this.playerY = data.y;
      this.draw();
    });

    //If the client gets the initial data from the server he has to use them approprietly.
    this.socket.on("asset", (data:any) => {
      console.log("Received initial assets.");
      //TODO: If you get the data. Draw the initial playing field.
      //TODO: If you are ready send out the event that you are ready.
      this.socket.emit("ready");
      
    });

    this.socket.on("draw", (player:object) => {
      this.player = player;
      this.draw();
    });


    // text that is submited through the input will be sent to the server
    this.form.addEventListener('submit', this.sendMsg.bind(this));

    // name of pressed keys are sent to the server
    document.addEventListener('keyup', this.keyHandler.bind(this));

    document.addEventListener('keydown', this.keyHandler.bind(this));
  }

  loadImages(){
   this.loadAssets([
     { name: 'character', url: './assets/Character.png' }
   ])
   .then((assets:any) => {
      //do we need notifyServer?
     window.requestAnimationFrame(this.notifyServer.bind(this));
   });
  }

  loadAsset(name:string, url:string) {
    return new Promise((resolve:any, reject:any) => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', function () {
        return resolve({ name, image: this });
      });
    });
  }

  loadAssets(assetsToLoad:any) {
    return Promise.all(
      assetsToLoad.map((asset:any) => this.loadAsset(asset.name, asset.url))
    ).then((assets:any) =>
      assets.reduceRight(
        (acc:any, elem:any) => ({ ...acc, [elem.name]: elem.image }),
        {}
      )
    );
  }

  // I want to do a loop in the server.
  notifyServer(){
    this.socket.emit("loop");
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

  keyHandler(event:any){
    this.socket.emit("keyPressed", [event.key, event.type]);
  }

  draw(){
    this.drawBackground();
    this.drawPlayers();
  }

  drawPlayers(){
    this.context.drawImage(this.playerImage, this.playerX, this.playerY, CONST.PLAYER_WIDTH, CONST.PLAYER_HEIGHT);
  }

  drawBackground(){
    this.context.drawImage(this.backgroundImage, 0, 0, CONST.CANVAS_WIDTH, CONST.CANVAS_HEIGHT);
  }

  drawLine(x1:number, y1:number, x2:number, y2:number) {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

}
