import { GlobalConstants as Const } from "../global/GlobalConstants"
import { Keys as Keys } from "../global/Keys"

export class Client {
    private socket:any = io();
    private canvas:any;
    private context:any;
    private character1:any = new Image();
    private character2:any = new Image();
    private background:any = new Image();
    private foreground: any = new Image();
    private target : any = new Image();
    private block : any = new Image();
    private shootObject : any = new Image();
    private defendObject : any = new Image();
    private gameState:any;
    private attackState : any;
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
        this.character1.src = `./${Const.ASSET_FOLDER}minions1.png`;
        this.character2.src = `./${Const.ASSET_FOLDER}minions2.png`;
        this.background.src = `./${Const.ASSET_FOLDER}background.png`;
        this.foreground.src = `./${Const.ASSET_FOLDER}foreground.png`;
        this.block.src = `./${Const.ASSET_FOLDER}clouds_trans.png`;
        this.shootObject.src = `./${Const.ASSET_FOLDER}block.png`;
        this.target.src = `./${Const.ASSET_FOLDER}target.png`;
        this.defendObject.src = `./${Const.ASSET_FOLDER}bubbles.png`;


        //Load the grid
        this.grid = Const.TEST_GRID_27x16;

        //Draw the initial background and start to register Events.
        this.drawBackground();
        this.drawGrid();
        this.registerEvents();
    }

    registerEvents(){
      //Event: Update with the new GameState
      this.socket.on('update', (gameState:any, attackState:any) =>{
          this.gameState = gameState;
          this.attackState = attackState;
          this.draw();
      });

      //Event: Wait until the server has an open spot again.
      this.socket.on('wait', (time : number) =>{
        console.log("The server is full at the moment. Please wait for a bit.")
        this.delayedReconnection(time);
      });

      //Event: Signal the server that a key has been pressed.
      window.addEventListener('keydown', (event : any) =>{
        console.log(event.key)
        this.keyPressedHandler(event.key, true)
      }, true);

      //Event: Stop moving when key is not pressed.
      window.addEventListener('keyup', (event : any) =>{
        this.keyPressedHandler(event.key, false)
      }, true);

      //Event: Mouse Movement, Coordinates of Mouse
      window.addEventListener('mousemove', (event: any) =>{
        let canvasRestrict = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / canvasRestrict.width;
        let scaleY = this.canvas.height / canvasRestrict.height;
        this.socket.emit('movingMouse', {
          cursor_X: (event.clientX - canvasRestrict.left)*scaleX,
          cursor_Y: (event.clientY - canvasRestrict.top)*scaleY
        });
      });

      window.addEventListener('click', (event: any) => {
        this.socket.emit('clicking');
      });
    }
   
    keyPressedHandler(inputId:string, state:boolean) {
      if (Object.values(Keys).includes(inputId)){
        this.socket.emit('keyPressed', {inputId: inputId, state: state});
      }
    }

    draw(){
      this.context.clearRect(0, 0, Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);
      this.drawBackground();
      this.drawPlayer();
      this.drawDefendObject();
      this.drawTarget();
      this.drawShootObject();
      this.drawGrid();
      this.drawForeground();
    }

    drawDefendObject(){
      let defendObject_X: number;
      let defendObject_Y: number;
      let clippingPositionX: number;
      let numberOfDefendImage = 2;
      for (var i = 0; i < this.gameState.length; i++){
        if(this.gameState[i].isDefending){
          defendObject_X = this.gameState[i].x - Const.BUBBLES_X_DIFF;
          defendObject_Y = this.gameState[i].y - Const.BUBBLES_Y_DIFF;
          this.gameState[i].isInTheAir ? clippingPositionX = Const.MIDDLE_SPRITE : clippingPositionX = Const.LEFT_SPRITE ;
          this.context.drawImage(
            this.defendObject,
            this.defendObject.width * clippingPositionX / numberOfDefendImage,
            0,
            this.defendObject.width / numberOfDefendImage,
            this.defendObject.height,
            defendObject_X,
            defendObject_Y,
            Const.BUBBLES_SIZE,
            Const.BUBBLES_SIZE
          )
        }
      }
    }

    drawShootObject(){
      let shootObject : any;
      for(var i = 0; i < this.attackState.length; i++) {
        if(this.attackState[i].player_ID === 1){
          shootObject = this.character1;
        }else{
          shootObject = this.character2;
        }
        this.context.drawImage(
          shootObject,
          shootObject.width*this.gameState[this.attackState[i].player_ID-1].spriteSheetPosition/Const.SPRITES_IN_ROW,
          0,                        
          shootObject.width/Const.SPRITES_IN_ROW,   
          shootObject.height,
          this.attackState[i].attack_X,
          this.attackState[i].attack_Y,
          Const.SHOOT_OBJECT_SIZE,
          Const.SHOOT_OBJECT_SIZE
        )
      }
    }

    drawTarget(){ //before: player:any
      //var currentPlayer = player;
      for (var i = 0; i < this.gameState.length; i++){
        this.context.drawImage(
          this.target,
          this.gameState[i].cursor_X, 
          this.gameState[i].cursor_Y, 
          Const.SHOOT_OBJECT_SIZE, 
          Const.SHOOT_OBJECT_SIZE
        );
      }
    }


    //Unbenennung von drawCharacter zu drawPlayer, 
    //da die Methode das Schießobjekt und die Zielscheibe 
    //des jeweiligen Spielers mit malt
    drawPlayer(){
      let character: any = new Image();
      for (var i = 0; i < this.gameState.length; i++){
          console.log(this.gameState[i].x);
          //use different image for each player
          if(this.gameState[i].id === 1){
            character = this.character1;
          }else{
            character = this.character2;
          }

          //draws player image on right position
          this.context.drawImage(
            character, 
            character.width*this.gameState[i].spriteSheetPosition/Const.SPRITES_IN_ROW, //x coordinate to start clipping
            0,                        //y coordinate to start clipping
            character.width/3,   //clipping width
            character.height,    //clipping height
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
              clippingPosition = Const.LEFT_SPRITE;
            }
            //Middle: preblock = 1, now = 1 and next = 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] === 1){
              clippingPosition = Const.MIDDLE_SPRITE;
            }
            //Back: preblock = 1, now = 0 and next != 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] !==1){
              clippingPosition = Const.RIGHT_SPRITE;
            }

            //draw block elements relative to part position from image
            if(this.grid[i][j] === 1){
              this.context.drawImage(
                this.block,
                this.block.width*clippingPosition/Const.SPRITES_IN_ROW, //position to start clipping
                0,
                this.block.width/Const.SPRITES_IN_ROW,
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
      this.context.drawImage(this.background, 0, 0, Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);
    }

    drawForeground(){
      this.context.drawImage(
        this.foreground, 
        0, 
        Const.CANVAS_HEIGHT - Const.FOREGROUND_HEIGHT, 
        Const.CANVAS_WIDTH, 
        Const.FOREGROUND_HEIGHT
        );
    }

    sleep(milliseconds : number) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async delayedReconnection(time : number) {
      await this.sleep(time);
      this.socket.emit('reconnection');
    }

}
