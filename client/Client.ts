import { GlobalConstants as Const } from "../global/GlobalConstants";
import { Keys, Events } from "../global/Enums";
import { GameState } from "../global/GameState";
import { PlayerState } from "../global/PlayerState";
import { ShootActionState } from "../global/ShootActionState";
import { Renderer } from "./Renderer";

export class Client {
    private socket: any = io();
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private gameState: GameState = new GameState();
    private renderingHandler: Renderer;
    private clientListIndex: number;

    constructor(){
        console.log("A Client has started.");

        //HTML Variables
        this.canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        //Set canvas size in html
        this.canvas.height = Const.CANVAS_HEIGHT;
        this.canvas.width = Const.CANVAS_WIDTH;

        //Set new renderingHandler
        this.renderingHandler = new Renderer(this.gameState, this.context);

        //Start resgistering events
        this.registerEvents();
    }

    registerEvents(){
      this.socket.on(Events.Update, (gameState:any) => {
        //set the new updated gameState
        this.setGameState(gameState);

        //Draw the current Gamestate
        this.renderingHandler.drawGameState(this.socket.id, this.clientListIndex);
        console.log(this.clientListIndex);

        this.displayCursor();
      });

      //Change your ID to the newly assigned ID.
      this.socket.on(Events.ID, (id : number, index: number)=>{
        this.socket.id = id;
        this.clientListIndex = index;
      })

      //Event: Wait until the server has an open spot again
      this.socket.on(Events.Wait, (time: number) =>{
        console.log("The server is full at the moment. Please wait for a bit.")
        this.delayedReconnection(time);
      });

      this.registerKeyEvents();
      this.registerMouseEvents();
    }

    keyPressedHandler(inputId: string, state: boolean) {
      if (Object.values(Keys).includes(inputId)){
        this.socket.emit(Events.KeyPressed, {inputId: inputId, state: state});
      }
    }

    mouseClickedHandler(button: number, state: boolean){
      if (Object.values(Keys).includes(button)){
        this.socket.emit(Events.MouseClicked, {button: button, state: state});
      }
    }

    sleep(milliseconds : number) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async delayedReconnection(time : number) {
      await this.sleep(time);
      this.socket.emit(Events.Reconnection);
    }

    setGameState(gameState: any){
      //Delete old GameState
      this.gameState.resetPlayerStates();

      //Make the GameState
      //Unpack playerStates
      for(let i in gameState.playerStates){
        const player = gameState.playerStates[i];
        if(player.shootActionState != undefined){
          let shootActionState = new ShootActionState({x: player.shootActionState.x, y: player.shootActionState.y});
          Object.assign(player, {'shootActionState': shootActionState});
        }

        let playerState = new PlayerState(player);
        this.gameState.addPlayerState(playerState);
      }

      this.gameState.timeLeft = gameState.timeLeft;
      this.gameState.gameOver = gameState.gameOver;
      this.gameState.playersReadyToStartGame = gameState.playersReadyToStartGame;
      this.gameState.winnerId = gameState.winnerId;
    }

    displayCursor(){
      if(!this.gameState.gameOver && !this.gameState.winnerIsCalculated()){
          this.canvas.style.cursor = "none";
      } else {
          this.canvas.style.cursor = "default";
      }
    }

    registerMouseEvents(){
      //Event: Mouse movement, coordinates of mouse
      window.addEventListener(Events.MouseMove, (event: MouseEvent) =>{
        let canvasRestrict = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / canvasRestrict.width;
        let scaleY = this.canvas.height / canvasRestrict.height;

        this.socket.emit(Events.MovingMouse, {
          cursorX: (event.clientX - canvasRestrict.left)*scaleX,
          cursorY: (event.clientY - canvasRestrict.top)*scaleY
        });
      });

      this.canvas.addEventListener(Events.MouseDown, (event: MouseEvent) => {
        this.mouseClickedHandler(event.button, true);
      });

      this.canvas.addEventListener(Events.MouseUp, (event: MouseEvent) => {
        this.mouseClickedHandler(event.button, false);
      });

      this.canvas.addEventListener(Events.ContextMenu, function(e){
        e.preventDefault();
      });
    }

    registerKeyEvents(){
      //Event: Signal the server that a key has been pressed
      window.addEventListener(Events.KeyDown, (event: KeyboardEvent) =>{
        this.keyPressedHandler(event.key.toLowerCase(), true)
      }, true);

      //Event: Stop moving when key is not pressed
      window.addEventListener(Events.KeyUp, (event: KeyboardEvent) =>{
        this.keyPressedHandler(event.key.toLowerCase(), false)
      }, true);
    }
}
