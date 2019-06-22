import { GlobalConstants as Const } from "../global/GlobalConstants"
import { Keys as Keys } from "../global/Keys"

export class Client {
    private socket:any = io();
    private canvas:any;
    private context:any;
    private character:any = new Image();
    private background:any = new Image();
    private block : any = new Image();
    private gameState:any;
    private grid : any = [];

    constructor(){
        console.log("A Client has started.");

        //HTML Variables
        this.canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        //Set canvas size in html
        
        this.canvas.height = Const.CANVAS_HEIGHT;
        this.canvas.width = Const.CANVAS_WIDTH;
        
        // Image Sources
        this.character.src = `./${Const.ASSET_FOLDER}character.png`;
        this.background.src = `./${Const.ASSET_FOLDER}background.png`;
        this.block.src = `./${Const.ASSET_FOLDER}block.png`;

        //Load the grid
        this.grid = Const.TEST_GRID_24x16; 
        
        //Draw the initial background and start to register Events.
        this.drawBackground();
        this.drawGrid();
        this.registerEvents();
    }

    registerEvents(){
      //Event: Update with the new GameState
      this.socket.on('update', (gameState:any) =>{
          this.gameState = gameState;
          this.draw();
      });

      //Event: Signal the server that a key has been pressed.
      window.addEventListener("keydown", (event : any) =>{
        console.log(event.key)
          this.keyPressedHandler(event.key, true)
      }, true);

      //Event: Stop moving when key is not pressed.
      window.addEventListener("keyup", (event : any) =>{
        this.keyPressedHandler(event.key, false)
      }, true);
    }

    keyPressedHandler(inputId:string, state:boolean) {
      if (Object.values(Keys).includes(inputId)){
        this.socket.emit('keyPressed', {inputId: inputId, state : state});
      }
    }

    draw(){
      this.drawBackground();
      this.drawGrid();
      this.drawCharacter();
    }

    drawCharacter(){
      for (var i = 0; i < this.gameState.length; i++){
          console.log(this.gameState[i].x);
          this.context.drawImage(this.character, this.gameState[i].x, this.gameState[i].y, Const.PLAYER_HEIGHT, Const.PLAYER_WIDTH);
      }
    }

    drawGrid(){
      if (Const.WITH_GRID){
        for (let i : number = 0; i < Const.GRID_HEIGHT; i++){
          for (let j : number = 0; j < Const.GRID_WIDTH; j++){
               if (this.grid[i][j] === 1){
                  this.context.drawImage(this.block, Const.BLOCK_HEIGHT * j, Const.BLOCK_WIDTH * i, Const.BLOCK_HEIGHT, Const.BLOCK_WIDTH);
               }
          }
        }
      }    
    }
    

    drawBackground(){
      this.context.drawImage(this.background, 0 ,0 , Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);
    }

}
