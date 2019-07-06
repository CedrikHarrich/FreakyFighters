import { GlobalConstants as Const } from "../global/GlobalConstants"
import { SpriteSheet } from "../global/SpriteSheet"
import { Keys as Keys } from "../global/Keys"
import { GameState, PlayerState, ActionState } from "../global/GameState"
import { lookup } from "dns";

export class Client {
    private socket: any = io();
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private sharedSpriteSheet: HTMLImageElement = new Image();
    private player_1_sprites: HTMLImageElement = new Image();
    private player_2_sprites: HTMLImageElement = new Image();
    private screens: HTMLImageElement = new Image();
    private foreground: HTMLImageElement = new Image();
    private gameState: GameState = new GameState();
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
        this.player_1_sprites.src = `./${Const.ASSET_FOLDER}SpriteSheet_Player_1.png`;
        this.player_2_sprites.src = `./${Const.ASSET_FOLDER}SpriteSheet_Player_2.png`;
        this.screens.src = `./${Const.ASSET_FOLDER}Screens.png`;
        this.foreground.src = `./${Const.ASSET_FOLDER}foreground.png`;

        //Load the grid
        this.grid = Const.GRID_1;

        //Draw the initial background and start to register Events.
        this.drawBackground();
        this.drawClouds();
        this.registerEvents();
    }

    registerEvents(){
      this.socket.on('end', (winner : number) => {
        if(this.socket.id === winner){
          this.drawWinnerScreen(this.socket.id);
        } else {
          this.drawLoserScreen(this.socket.id);
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
        this.gameState.winner = gameState.winner;
        this.gameState.timeLeft = gameState.timeLeft;
        
        //Draw the current Gamestate
        this.draw();
      });

       //Change your ID to the assigned new ID.
       this.socket.on('ID', (id : number)=>{
        this.socket.id = id;
      })

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
      this.context.arc(Const.TIMER_X, Const.TIMER_Y, Const.TIMER_RADIUS, -0.5 * Math.PI , (2* (this.gameState.timeLeft / Const.COUNTDOWN) - 0.5) * Math.PI);
      this.context.lineTo(Const.TIMER_X, Const.TIMER_Y);
      this.context.lineTo(Const.TIMER_X, Const.TIMER_Y - Const.BLOCK_HEIGHT);
      
      this.context.fillStyle = "#F5A9AF";
      this.context.fill();
    }

    drawDefendObject(){
      let defendObject_X: number;
      let defendObject_Y: number;
      let clippingPosition: {x: number, y: number};
      let playerStates = this.gameState.getPlayerStates();

      for(var i = 0; i < playerStates.length; i++) {
        let playerState = this.gameState.getPlayerState(i);
        if(playerState.getIsDefending()){
          defendObject_X = playerState.getX() - Const.DEFENSE_X_DIFF;
          defendObject_Y = playerState.getY() - Const.DEFENSE_Y_DIFF;
          clippingPosition = playerState.getIsInTheAir() ? SpriteSheet.DEFENSE_AIR : SpriteSheet.DEFENSE_GROUND;
          
          this.context.drawImage(
            this.sharedSpriteSheet,
            this.sharedSpriteSheet.width * clippingPosition.x / SpriteSheet.SPRITES_IN_ROW,
            this.sharedSpriteSheet.height * clippingPosition.y /SpriteSheet.SPRITES_IN_COLUMN_SHARED,
            this.sharedSpriteSheet.width / SpriteSheet.SPRITES_IN_ROW,
            this.sharedSpriteSheet.height / SpriteSheet.SPRITES_IN_COLUMN_SHARED,
            defendObject_X,
            defendObject_Y,
            Const.DEFENSE_SIZE,
            Const.DEFENSE_SIZE
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
          
          shootObject = playerState.getId() === 1 ? this.player_1_sprites : this.player_2_sprites;

          this.context.drawImage(
            shootObject,
            shootObject.width * SpriteSheet.SHOOT.x/ SpriteSheet.SPRITES_IN_ROW ,
            shootObject.height * SpriteSheet.SHOOT.y / SpriteSheet.SPRITES_IN_COLUMN,
            shootObject.width / SpriteSheet.SPRITES_IN_ROW,
            shootObject.height / SpriteSheet.SPRITES_IN_COLUMN,
            playerState.getActionX(),
            playerState.getActionY(),
            Const.SHOOT_OBJECT_SIZE,
            Const.SHOOT_OBJECT_SIZE
          )
        }

      }
    }

    drawTarget(){ 
      let playerStates = this.gameState.getPlayerStates(),
        target: HTMLImageElement = new Image();

      for (var i = 0; i < playerStates.length; i++){
        let playerState = this.gameState.getPlayerState(i);

        target = playerState.getId() === 1 ? this.player_1_sprites : this.player_2_sprites;

        this.context.drawImage(
          target,
          target.width * SpriteSheet.TARGET.x / SpriteSheet.SPRITES_IN_ROW,
          target.height * SpriteSheet.TARGET.y / SpriteSheet.SPRITES_IN_COLUMN,
          target.width / SpriteSheet.SPRITES_IN_ROW,
          target.height / SpriteSheet.SPRITES_IN_COLUMN,
          playerState.getCursorX(),
          playerState.getCursorY(),
          Const.SHOOT_OBJECT_SIZE,
          Const.SHOOT_OBJECT_SIZE
        );
      }
    }

    
    drawPlayer(){
      let character: HTMLImageElement = new Image(),
          playerStates = this.gameState.getPlayerStates();

      for (var i = 0; i < playerStates.length; i++){
        let playerState = this.gameState.getPlayerState(i);

          //use different image for each player
          if(playerState.getId() === 1){
            character = this.player_1_sprites;
          } else {
            character = this.player_2_sprites;
          }

          //draws player image on right position
          this.context.drawImage(
            character,
            character.width * playerState.getClippingPosition().x / SpriteSheet.SPRITES_IN_ROW, //x coordinate to start clipping
            character.height * playerState.getClippingPosition().y / SpriteSheet.SPRITES_IN_COLUMN,                        //y coordinate to start clipping
            character.width / SpriteSheet.SPRITES_IN_ROW,   //clipping width
            character.height / SpriteSheet.SPRITES_IN_COLUMN,    //clipping height
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
        let clippingPosition: {x:number, y:number};

        //scan only in possible block positions
        for (let i : number = Const.MAX_BLOCK_POSITION_Y; i < Const.MIN_BLOCK_POSITION_Y; i++){
          preBlock = 0;
          for (let j : number = 0; j < Const.GRID_WIDTH; j++){
            //Front: preblock = 0 and now = 1
            if (preBlock === 0 && this.grid[i][j] === 1){
              clippingPosition = SpriteSheet.CLOUD_LEFT;
            }
            //Middle: preblock = 1, now = 1 and next = 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] === 1){
              clippingPosition = SpriteSheet.CLOUD_MIDDLE;
            }
            //Back: preblock = 1, now = 0 and next != 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] !==1){
              clippingPosition = SpriteSheet.CLOUD_RIGHT;
            }

            if(this.grid[i][j] === 1){
              this.context.drawImage(
                this.sharedSpriteSheet,
                this.sharedSpriteSheet.width * clippingPosition['x'] / SpriteSheet.SPRITES_IN_ROW,
                this.sharedSpriteSheet.height * clippingPosition['y'] / SpriteSheet.SPRITES_IN_COLUMN_SHARED,
                this.sharedSpriteSheet.width / SpriteSheet.SPRITES_IN_ROW,
                this.sharedSpriteSheet.height / SpriteSheet.SPRITES_IN_COLUMN_SHARED,
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
      this.context.drawImage(this.screens, 0, 0, Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT,0,0, Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);
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

    drawWinnerScreen(playerId:number){
      let winner : HTMLImageElement = new Image();

      this.context.drawImage(
        this.screens,
        0,
        Const.CANVAS_HEIGHT,
        Const.CANVAS_WIDTH,
        Const.CANVAS_HEIGHT,
        0,
        0,
        Const.CANVAS_WIDTH,
        Const.CANVAS_HEIGHT
      )

      winner = playerId === 1 ? this.player_1_sprites : this.player_2_sprites;

      this.context.drawImage(
        winner,
        winner.width * SpriteSheet.WINNER.x / SpriteSheet.SPRITES_IN_ROW,
        winner.height * SpriteSheet.WINNER.y / SpriteSheet.SPRITES_IN_COLUMN,
        winner.width / SpriteSheet.SPRITES_IN_ROW,
        winner.height / SpriteSheet.SPRITES_IN_COLUMN,
        Const.GAMEOVER_WINNER_X,
        Const.GAMEOVER_WINNER_Y,
        Const.GAMEOVER_WINNER_SIZE,
        Const.GAMEOVER_WINNER_SIZE
      )
    }

    drawLoserScreen(playerId:number){
      let loser: HTMLImageElement = new Image();
      this.context.drawImage(
        this.screens,
        0,
        Const.CANVAS_HEIGHT*SpriteSheet.SPRITES_IN_COLUMN_SHARED,
        Const.CANVAS_WIDTH,
        Const.CANVAS_HEIGHT,
        0,
        0,
        Const.CANVAS_WIDTH,
        Const.CANVAS_HEIGHT
      )

      loser = playerId === 1 ? this.player_1_sprites : this.player_2_sprites;
      
      this.context.drawImage(
        loser,
        loser.width * SpriteSheet.LOSER.x / SpriteSheet.SPRITES_IN_ROW,
        loser.height * SpriteSheet.LOSER.y / SpriteSheet.SPRITES_IN_COLUMN,
        loser.width / SpriteSheet.SPRITES_IN_ROW,
        loser.height / SpriteSheet.SPRITES_IN_COLUMN,
        Const.GAMEOVER_LOSER_X,
        Const.GAMEOVER_LOSER_Y,
        Const.GAMEOVER_LOSER_SIZE,
        Const.GAMEOVER_LOSER_SIZE
      )
    }

    sleep(milliseconds : number) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async delayedReconnection(time : number) {
      await this.sleep(time);
      this.socket.emit('reconnection');
    }

}
