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
      this.registerUpdatedGameState();
      this.registerAssignedId();
      this.registerWaitingInQueue();
      this.registerKeyEvents();
      this.registerMouseEvents();
    }

    //listens to updates and set updated game information
    registerUpdatedGameState(){
      this.socket.on(Events.Update, (gameState:any) => {
        //set the new updated gameState
        this.setGameState(gameState);

        //draw the current gameState
        this.renderingHandler.drawGameState(this.socket.id, this.clientListIndex);
        this.displayCursor();
      });
    }

    //change your ID to the newly assigned ID and save your index in the clientList.
    registerAssignedId(){
      this.socket.on(Events.ID, (id : number, index: number)=>{
        this.socket.id = id;
        this.clientListIndex = index;
      });
    }

    //Event: Wait until the server has an open spot again
    registerWaitingInQueue(){
      this.socket.on(Events.Wait, (time: number) =>{
        console.log("The server is full at the moment. Please wait for a bit.")
        this.delayedReconnection(time);
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

    registerMouseEvents(){
      //register movements of the mouse
      this.mouseMoveEventListener();
      //register pressed buttons of the mouse
      this.mouseButtonListener();
    }

    mouseMoveEventListener(){
       //Event: Mouse movement, send coordinates of mouse
       window.addEventListener(Events.MouseMove, (event: MouseEvent) =>{
        let canvasRestrict = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / canvasRestrict.width;
        let scaleY = this.canvas.height / canvasRestrict.height;

        this.socket.emit(Events.MovingMouse, {
          cursorX: (event.clientX - canvasRestrict.left)*scaleX,
          cursorY: (event.clientY - canvasRestrict.top)*scaleY
        });
      });
    }

    mouseButtonListener(){
      //Event: Mouse button pressed
      this.canvas.addEventListener(Events.MouseDown, (event: MouseEvent) => {
        this.mouseClickedHandler(event.button, true);
      });

      this.canvas.addEventListener(Events.MouseUp, (event: MouseEvent) => {
        this.mouseClickedHandler(event.button, false);
      });

      this.canvas.addEventListener(Events.ContextMenu, function(e){
        e.preventDefault();
      });

      document.getElementById("instructionBtn").addEventListener(Events.MouseClickedNative, () => {
          this.showInstructions();
      });
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

    //HTML button "See how to play the game"
    showInstructions(){
      let instructionImg = document.getElementById("instructionImg");

      instructionImg.classList.toggle("hidden");

    }

    setGameState(gameState: any){
      //Delete old GameState
      this.gameState.resetPlayerStates();

      //Unpack playerStates
      this.unpackPlayerStates(gameState.playerStates);

      //Set updated globally used gameState variables
      this.setGameStateVariables(gameState);
    }

    unpackPlayerStates(playerStates: any){
      for(let i in playerStates){
        const player = playerStates[i];
        if(player.shootActionState != undefined){
          let shootActionState = new ShootActionState({x: player.shootActionState.x, y: player.shootActionState.y});
          Object.assign(player, {'shootActionState': shootActionState});
        }

        let playerState = new PlayerState(player);
        this.gameState.addPlayerState(playerState);
      }
    }

    setGameStateVariables(gameState: any){
      this.gameState.timeLeft = gameState.timeLeft;
      this.gameState.gameOver = gameState.gameOver;
      this.gameState.playersReadyToStartGame = gameState.playersReadyToStartGame;
      this.gameState.winnerId = gameState.winnerId;
    }

    //hide cursor during game for target image to be seen only
    displayCursor(){
      if(!this.gameState.gameOver && !this.gameState.winnerIsCalculated()){
          this.canvas.style.cursor = "none";
      } else {
          this.canvas.style.cursor = "default";
      }
    }

    sleep(milliseconds : number) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async delayedReconnection(time : number) {
      await this.sleep(time);
      this.socket.emit(Events.Reconnection);
    }
}
