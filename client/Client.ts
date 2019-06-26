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
        this.character.src = `./${Const.ASSET_FOLDER}minions2.png`;
        this.background.src = `./${Const.ASSET_FOLDER}background.png`;
        this.block.src = `./${Const.ASSET_FOLDER}clouds.png`;

        //Load the grid
        this.grid = Const.TEST_GRID_27x16; 
        
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

      this.socket.on('wait', (time : number) =>{
        console.log("The server is full at the moment. Please wait for a bit.")
        this.delayedReconnection(time);
      })

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

    Sleep(milliseconds : number) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async delayedReconnection(time : number) {
      await this.Sleep(time);
      this.socket.emit('reconnection');
    }

    drawCharacter(){
      for (var i = 0; i < this.gameState.length; i++){
          console.log(this.gameState[i].x);

          this.context.drawImage(
            this.character, 
            this.character.width*this.gameState[i].characterNumber/3, //x coordinate to start clipping
            0,                        //y coordinate to start clipping
            this.character.width/3,   //clipping width
            this.character.height,    //clipping height
            this.gameState[i].x, 
            this.gameState[i].y, 
            Const.PLAYER_WIDTH,       //resize to needed width
            Const.PLAYER_HEIGHT,      //resize to needed height
            );
      }
    }

    drawGrid(){
      if (Const.WITH_GRID){
        let preBlock: number; 
        let clippingPosition: number;

        //scan only in possible block positions
        for (let i : number = Const.MAX_BLOCK_POSITION_Y; i < Const.MIN_BLOCK_POSITION_Y; i++){
          preBlock = 0;
          for (let j : number = 0; j < Const.GRID_WIDTH; j++){
            //Front: preblock = 0 and now = 1
            if (preBlock === 0 && this.grid[i][j] === 1){
              clippingPosition = 0;
            }
            //Middle: preblock = 1, now = 1 and next = 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] === 1){
              clippingPosition = 1;
            }
            //Back: preblock = 1, now = 0 and next != 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] !==1){
              clippingPosition = 2;
            }

            //draw block elements relative to part position from image
            if(this.grid[i][j] === 1){
              this.context.drawImage(
                this.block,
                this.block.width*clippingPosition/3, //position to start clipping 
                0,
                this.block.width/3,
                this.block.height,
                Const.BLOCK_WIDTH * j,
                Const.BLOCK_HEIGHT * i, 
                Const.BLOCK_WIDTH,
                Const.BLOCK_HEIGHT);
            }
            //previous Block is now current Block
            preBlock = this.grid[i][j];

          }
        }
      }    
    }
    

    drawBackground(){
      this.context.drawImage(this.background, 0 ,0 , Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);
    }

}
