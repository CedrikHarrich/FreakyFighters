import { GlobalConstants as Const } from "../global/GlobalConstants"
import { SpriteSheet } from "../global/SpriteSheet"
import { Keys as Keys } from "../global/Keys"
import { GameState, PlayerState, ActionState } from "../global/GameState"

export class Client {
    private socket: any = io();
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private sharedSpriteSheet: HTMLImageElement = new Image();
    private character1: HTMLImageElement = new Image();
    private character2: HTMLImageElement = new Image();
    private background: HTMLImageElement = new Image();
    private foreground: HTMLImageElement = new Image();
    private target: HTMLImageElement = new Image();
    private block: HTMLImageElement = new Image();
    private shootObject: HTMLImageElement = new Image();
    private gameState: GameState;
    private grid: Array<Array<number>> = [];

    constructor(){
        console.log("A Client has started.");

        //HTML Variables
        this.canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        //Set canvas size in html
        this.canvas.height = Const.CANVAS_HEIGHT;
        this.canvas.width = Const.CANVAS_WIDTH;

        // Image Sources
        this.sharedSpriteSheet.src = `./${Const.ASSET_FOLDER}SpriteSheet_Shared.png`;
        this.character1.src = `./${Const.ASSET_FOLDER}minions1.png`;
        this.character2.src = `./${Const.ASSET_FOLDER}minions2.png`;
        this.background.src = `./${Const.ASSET_FOLDER}background.png`;
        this.foreground.src = `./${Const.ASSET_FOLDER}foreground.png`;
        this.block.src = `./${Const.ASSET_FOLDER}clouds_trans.png`;
        this.shootObject.src = `./${Const.ASSET_FOLDER}block.png`;
        this.target.src = `./${Const.ASSET_FOLDER}target.png`;

        //Load the grid
        this.grid = Const.GRID_1;

        //Draw the initial background and start to register Events.
        this.drawBackground();
        this.drawClouds();
        this.registerEvents();
    }

    registerEvents(){
      this.socket.on('update', (gameState:any) =>{
         this.gameState = new GameState();

         for(var i in gameState.playerStates){

           if(gameState.playerStates[i].actionState != undefined){
             let actionState = new ActionState({x: gameState.playerStates[i].actionState.x, y: gameState.playerStates[i].actionState.y});
             Object.assign(gameState.playerStates[i], {'actionState': actionState});
           }

           let playerState = new PlayerState(gameState.playerStates[i]);

           this.gameState.addPlayerState(playerState);
         }

         this.draw();
      });

      //Event: Wait until the server has an open spot again.
      this.socket.on('wait', (time: number) =>{
        console.log("The server is full at the moment. Please wait for a bit.")
        this.delayedReconnection(time);
      });

      //Event: Signal the server that a key has been pressed.
      window.addEventListener('keydown', (event: KeyboardEvent) =>{
        console.log(event.key)
        this.keyPressedHandler(event.key, true)
      }, true);

      //Event: Stop moving when key is not pressed.
      window.addEventListener('keyup', (event: KeyboardEvent) =>{
        this.keyPressedHandler(event.key, false)
      }, true);

      //Event: Mouse Movement, Coordinates of Mouse
      window.addEventListener('mousemove', (event: MouseEvent) =>{
        let canvasRestrict = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / canvasRestrict.width;
        let scaleY = this.canvas.height / canvasRestrict.height;
        this.socket.emit('movingMouse', {
          cursorX: (event.clientX - canvasRestrict.left)*scaleX,
          cursorY: (event.clientY - canvasRestrict.top)*scaleY
        });
      });
    }

    keyPressedHandler(inputId: string, state: boolean) {
      if (Object.values(Keys).includes(inputId)){
        this.socket.emit('keyPressed', {inputId: inputId, state: state});
      }
    }

    draw(){
      this.context.clearRect(0, 0, Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);
      this.drawBackground();
      this.drawSunTimer();
      this.drawPlayer();
      this.drawDefendObject();
      this.drawTarget();
      this.drawShootObject();
      this.drawClouds();
      this.drawForeground();
    }

    drawSunTimer(){
      this.context.beginPath();
      this.context.moveTo(540, 30);
      this.context.lineTo(540, 70);
      this.context.arc(540, 70, 40, -0.5*Math.PI *1/60, 1.5 * Math.PI); //(2*Math.PI)*1/60
      this.context.fillStyle = "#F5A9AF";
      this.context.fill();
    }

    drawDefendObject(){
      let defendObject_X: number;
      let defendObject_Y: number;
      let clippingPositionX: number;
      let playerStates = this.gameState.getPlayerStates();

      for(var i = 0; i < playerStates.length; i++) {
        let playerState = this.gameState.getPlayerState(i);
        if(playerState.getIsDefending()){
          defendObject_X = playerState.getX() - Const.DEFENCE_X_DIFF;
          defendObject_Y = playerState.getY() - Const.DEFENCE_Y_DIFF;
          clippingPositionX = playerState.getIsInTheAir() ? SpriteSheet.MIDDLE_SPRITE : SpriteSheet.LEFT_SPRITE;
          
          this.context.drawImage(
            this.sharedSpriteSheet,
            this.sharedSpriteSheet.width * clippingPositionX / SpriteSheet.SPRITES_IN_ROW,
            this.sharedSpriteSheet.height * 1 /SpriteSheet.SPRITES_IN_COLUMN, //die 1 änder ich noch! SpriteSheet noch nicht fertig
            this.sharedSpriteSheet.width / SpriteSheet.SPRITES_IN_ROW,
            this.sharedSpriteSheet.height / SpriteSheet.SPRITES_IN_COLUMN,
            defendObject_X,
            defendObject_Y,
            Const.DEFENCE_SIZE,
            Const.DEFENCE_SIZE
          );
        }
      }
    }

    drawShootObject(){
      let shootObject: HTMLImageElement,
          playerStates = this.gameState.getPlayerStates();

      for(var i = 0; i < playerStates.length; i++) {
        let playerState = this.gameState.getPlayerState(i);

        if(playerState.getIsTakingAction()){
          if(playerState.getId() === 1){
            shootObject = this.character1;
          }else{
            shootObject = this.character2;
          }

          this.context.drawImage(
            shootObject,
            shootObject.width / SpriteSheet.SPRITES_IN_ROW ,
            0,
            shootObject.width / SpriteSheet.SPRITES_IN_ROW,
            shootObject.height,
            playerState.getActionX(),
            playerState.getActionY(),
            Const.SHOOT_OBJECT_SIZE,
            Const.SHOOT_OBJECT_SIZE
          )
        }

      }
    }

    drawTarget(){ //before: player:any
      let playerStates = this.gameState.getPlayerStates();

      for (var i = 0; i < playerStates.length; i++){
        let playerState = this.gameState.getPlayerState(i);

        this.context.drawImage(
          this.target,
          playerState.getCursorX(),
          playerState.getCursorY(),
          Const.SHOOT_OBJECT_SIZE,
          Const.SHOOT_OBJECT_SIZE
        );
      }
    }

    //Unbenennung von drawCharacter zu drawPlayer,
    //da die Methode das Schießobjekt und die Zielscheibe
    //des jeweiligen Spielers mit malt
    drawPlayer(){
      let character: HTMLImageElement = new Image(),
          playerStates = this.gameState.getPlayerStates();

      for (var i = 0; i < playerStates.length; i++){
        let playerState = this.gameState.getPlayerState(i);

          //use different image for each player
          if(playerState.getId() === 1){
            character = this.character1;
          } else {
            character = this.character2;
          }

          //draws player image on right position
          this.context.drawImage(
            character,
            character.width * playerState.getSpriteNumber() / SpriteSheet.SPRITES_IN_ROW, //x coordinate to start clipping
            0,                        //y coordinate to start clipping
            character.width/SpriteSheet.SPRITES_IN_ROW,   //clipping width
            character.height,    //clipping height
            playerState.getX(),
            playerState.getY(),
            Const.PLAYER_WIDTH,       //resize to needed width
            Const.PLAYER_HEIGHT,      //resize to needed height
            );
      }
    }

    drawClouds(){
      if (Const.WITH_GRID){
        let preBlock: number;
        let clippingPositionX: number;

        //scan only in possible block positions
        for (let i : number = Const.MAX_BLOCK_POSITION_Y; i < Const.MIN_BLOCK_POSITION_Y; i++){
          preBlock = 0;
          for (let j : number = 0; j < Const.GRID_WIDTH; j++){
            //Front: preblock = 0 and now = 1
            if (preBlock === 0 && this.grid[i][j] === 1){
              clippingPositionX = SpriteSheet.LEFT_SPRITE;
            }
            //Middle: preblock = 1, now = 1 and next = 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] === 1){
              clippingPositionX = SpriteSheet.MIDDLE_SPRITE;
            }
            //Back: preblock = 1, now = 0 and next != 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] !==1){
              clippingPositionX = SpriteSheet.RIGHT_SPRITE;
            }

            //draw block elements relative to part position from image
            if(this.grid[i][j] === 1){
              this.context.drawImage(
                this.block,
                this.block.width*clippingPositionX / SpriteSheet.SPRITES_IN_ROW, //position to start clipping
                0,
                this.block.width / SpriteSheet.SPRITES_IN_ROW,
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
