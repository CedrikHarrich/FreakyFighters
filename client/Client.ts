import { GlobalConstants as Const } from "../global/GlobalConstants"
import { Keys as Keys } from "../global/Keys"
import { GameState, PlayerState, ShootActionState } from "../global/GameState"
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
        } else if(winner === Const.GAMEOVER_DRAW){
          this.renderingHandler.drawNoWinnerScreen();
        } else {
          this.renderingHandler.drawLoserScreen(this.socket.id);
        }
        
        this.canvas.style.cursor = "default";
      });

      this.socket.on('update', (gameState:any) => {
        //set the new updated gameState
        this.setGameState(gameState);
       
        //hide cursor during game
        this.displayCursor();

        //Draw the current Gamestate
        this.drawGameState();
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

      this.registerKeyEvents();
      this.registerMouseEvents();
    }

    keyPressedHandler(inputId: string, state: boolean) {
      if (Object.values(Keys).includes(inputId)){
        this.socket.emit('keyPressed', {inputId: inputId, state: state});
      }
    }

    mouseClickedHandler(button: number, state: boolean){
      if (Object.values(Keys).includes(button)){
        this.socket.emit('mouseClicked', {button: button, state: state});
      }
    }

    sleep(milliseconds : number) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async delayedReconnection(time : number) {
      await this.sleep(time);
      this.socket.emit('reconnection');
    }

    setGameState(gameState: any){
      //Delete old GameState
      this.gameState.resetPlayerStates();

      //Make the GameState
      for(var i in gameState.playerStates){
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
      this.gameState.playersInGame = gameState.playersInGame;
    }

    drawGameState(){
      this.renderingHandler.drawGame(this.gameState);

      if((this.gameState.gameOver === true) && this.gameState.getWinner() < 0){
        this.renderingHandler.drawStartScreen(this.socket.id);
      }    
    }

    displayCursor(){
      if(!this.gameState.getGameOver() && this.gameState.playerStates.length === 2){
        this.canvas.style.cursor = "none";
      } else {
        this.canvas.style.cursor = "default";
      }
    }

    registerMouseEvents(){
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

      this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
        this.mouseClickedHandler(event.button, true);
      });

      this.canvas.addEventListener('mouseup', (event: MouseEvent) => {
        this.mouseClickedHandler(event.button, false);
      });

      this.canvas.addEventListener('contextmenu', function(e){
        e.preventDefault();
      });
    }

    registerKeyEvents(){
      //Event: Signal the server that a key has been pressed
      window.addEventListener('keydown', (event: KeyboardEvent) =>{
        console.log(event.key)
        this.keyPressedHandler(event.key, true)
      }, true);

      //Event: Stop moving when key is not pressed
      window.addEventListener('keyup', (event: KeyboardEvent) =>{
        this.keyPressedHandler(event.key, false)
      }, true);
    }
}
