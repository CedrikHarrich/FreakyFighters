import { GlobalConstants as Const } from "../global/GlobalConstants"
import { Keys as Keys } from "../global/Keys"
import { GameState, PlayerState, ActionState } from "../global/GameState"
import { Renderer } from "./Renderer";

export class Client {
    private socket: any = io();
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private gameState: GameState = new GameState();
    private renderingHandler: Renderer;

    constructor(){
        console.log("A Client has started.");

        //HTML Variables
        this.canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        //Set canvas size in html
        this.canvas.height = Const.CANVAS_HEIGHT;
        this.canvas.width = Const.CANVAS_WIDTH;

        //Start resgistering events
        this.registerEvents();
    }

    registerEvents(){
      //Set new renderingHandler
      this.renderingHandler = new Renderer(this.gameState, this.context);

      this.socket.on('end', (winner : number) => {
        if(this.socket.id === winner){
          this.renderingHandler.drawWinnerScreen(this.socket.id);
        } else {
          this.renderingHandler.drawLoserScreen(this.socket.id);
        }
      })


      this.socket.on('update', (gameState:any) => {
        //Delete old GameState
        this.gameState.resetPlayerStates();

        //Make the GameState
        for(var i in gameState.playerStates){
          if(gameState.playerStates[i].actionState != undefined){
            let actionState = new ActionState({x: gameState.playerStates[i].actionState.x, y: gameState.playerStates[i].actionState.y});
            Object.assign(gameState.playerStates[i], {'actionState': actionState});
          }

          let playerState = new PlayerState(gameState.playerStates[i]);

          this.gameState.addPlayerState(playerState);
        }

        this.gameState.timeLeft = gameState.timeLeft;

        //Draw the current Gamestate
        this.renderingHandler.draw(this.gameState);
      });

       //Change your ID to the newly assigned ID.
       this.socket.on('ID', (id : number)=>{
        this.socket.id = id;
      })

      //Event: Wait until the server has an open spot again
      this.socket.on('wait', (time: number) =>{
        console.log("The server is full at the moment. Please wait for a bit.")
        this.delayedReconnection(time);
      });

      //Event: Signal the server that a key has been pressed
      window.addEventListener('keydown', (event: KeyboardEvent) =>{
        console.log(event.key)
        this.keyPressedHandler(event.key, true)
      }, true);

      //Event: Stop moving when key is not pressed
      window.addEventListener('keyup', (event: KeyboardEvent) =>{
        this.keyPressedHandler(event.key, false)
      }, true);

      //Event: Mouse movement, coordinates of mouse
      window.addEventListener('mousemove', (event: MouseEvent) =>{
        let canvasRestrict = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / canvasRestrict.width;
        let scaleY = this.canvas.height / canvasRestrict.height;
        this.socket.emit('movingMouse', {
          cursorX: (event.clientX - canvasRestrict.left)*scaleX,
          cursorY: (event.clientY - canvasRestrict.top)*scaleY
        });
      });

      window.addEventListener('mousedown', (event: MouseEvent) => {
        this.mouseClickedHandler(event.button, true);
      });

      window.addEventListener('mouseup', (event: MouseEvent) => {
        this.mouseClickedHandler(event.button, false);
      });

      window.addEventListener('contextmenu', function(e){
        e.preventDefault();
      })
    }

    keyPressedHandler(inputId: string, state: boolean) {
      if (Object.values(Keys).includes(inputId)){
        this.socket.emit('keyPressed', {inputId: inputId, state: state});
      }
    }

    mouseClickedHandler(button: number, state: boolean){
      if (Object.values(Keys).includes(button)){
        this.socket.emit('buttonClicked', {button: button, state: state});
      }
    }

    sleep(milliseconds : number) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async delayedReconnection(time : number) {
      await this.sleep(time);
      this.socket.emit('reconnection');
    }

}
