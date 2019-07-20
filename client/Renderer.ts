import { GlobalConstants as Const } from "../global/GlobalConstants"
import { SpriteSheet } from "../global/SpriteSheet"
import { GameState, PlayerState } from "../global/GameState"

export class Renderer {
    private context: CanvasRenderingContext2D;
    private sharedSpriteSheet: HTMLImageElement = new Image();
    private player_1_sprites: HTMLImageElement = new Image();
    private player_2_sprites: HTMLImageElement = new Image();
    private screens: HTMLImageElement = new Image();
    private grid: Array<Array<number>> = Const.GRID_1;
    private gameState: GameState = new GameState();
    private wasProtectedTime: {time: number, player_id: number} = {time: 0, player_id: Const.ID_INITIAL_STATE};
    private wasHitTime: {time: number, player_id: number} = {time: 0, player_id: Const.ID_INITIAL_STATE};

    constructor(gameState: GameState, context: CanvasRenderingContext2D){
        //Load all images
        this.sharedSpriteSheet.src = `./${Const.ASSET_FOLDER}SpriteSheet_Shared.png`;
        this.player_1_sprites.src = `./${Const.ASSET_FOLDER}SpriteSheet_Player_1.png`;
        this.player_2_sprites.src = `./${Const.ASSET_FOLDER}SpriteSheet_Player_2.png`;
        this.screens.src = `./${Const.ASSET_FOLDER}Screens.png`;
        this.context = context;
        this.gameState = gameState;
    }

    drawGame(gameState: GameState){
        this.gameState = gameState;
        this.context.clearRect(0, 0, Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);
        this.drawBackground();
        this.drawSunTimer();
        this.drawPlayer();
        this.drawDefenseObject();
        this.drawClouds();
        this.drawTarget();
        this.drawShootObject();
        this.drawLifeBar();
        this.drawForeground();
    }

    drawSunTimer(){
        this.context.beginPath();
        this.context.arc(
          Const.TIMER_X,
          Const.TIMER_Y,
          Const.TIMER_RADIUS,
          Const.START_ANGLE ,
          (2*(this.gameState.timeLeft / Const.COUNTDOWN) - 0.5)*Math.PI //END_ANGLE
        );
        this.context.lineTo(Const.TIMER_X, Const.TIMER_Y);
        this.context.lineTo(Const.TIMER_X, Const.TIMER_Y - Const.BLOCK_HEIGHT);

        this.context.fillStyle = Const.TIMER_COLOR;
        this.context.fill();
      }
    
    drawStartScreen(playerId: number){
      let image : HTMLImageElement = new Image(),
        clippingPosition: {x: number, y: number};

      //draw start screen background
      this.drawScreen(SpriteSheet.START_SCREEN);
      
      clippingPosition = this.gameState.playersInGame[playerId] ? SpriteSheet.PLAYER_READY : SpriteSheet.PLAYER_NOT_READY;
      //draw ready state circle around profile picture
      this.drawSquareImage(
        this.sharedSpriteSheet,
        clippingPosition,
        Const.READY_STATE_POSITION,
        Const.READY_STATE_SIZE
      );
      
      image = playerId === 1 ? this.player_1_sprites : this.player_2_sprites;
      //draw profile picture
      this.drawSquareImage(
        image,
        SpriteSheet.PROFILPICTURE,
        Const.PROFILE_PICTURE_POSITION,
        Const.PROFILE_PICTURE_SIZE
      );
    }

    //TODO: geht bestimmt kürzer! Sonst eine Hilfsmethode auslagern
    drawLifeBar(){
      let lifeBar: HTMLImageElement = new Image();
      let lifeBarFrameCoords: {x: number, y: number};
      let lifeBarCoordX: number;
      let clippingPositionX: number;
      let lifeBarWidth: number = this.player_1_sprites.width;
      let lifeBarPoints: number = lifeBarWidth / Const.MAX_HP;
      let playerStates = this.gameState.getPlayerStates();

      for(var i = 0; i < playerStates.length; i++) {
        let playerState = this.gameState.getPlayerState(i);
        let healthPoints = playerState.getHealthPoints();

        if(playerState.getId() === 1){
          lifeBar = this.player_1_sprites;
          lifeBarFrameCoords = Const.LIFE_BAR_FRAME_1_COORDS;
          clippingPositionX = SpriteSheet.LIFE_BAR.x;
          lifeBarCoordX = Const.LIFE_BAR_1_COORDS.x;
        }else{
          lifeBar = this.player_2_sprites;
          lifeBarFrameCoords = Const.LIFE_BAR_FRAME_2_COORDS;
          clippingPositionX = SpriteSheet.LIFE_BAR.x + ((Const.MAX_HP - healthPoints) * lifeBarPoints);
          lifeBarCoordX = Const.LIFE_BAR_2_COORDS.x + ((Const.MAX_HP - healthPoints) * Const.LIFE_BAR_POINT);
        }

        //draws life bar frame
        this.context.drawImage(
          lifeBar,
          SpriteSheet.LIFE_BAR_FRAME.x,
          SpriteSheet.LIFE_BAR_FRAME.y,
          lifeBar.width,
          SpriteSheet.SPRITE_SIZE,
          lifeBarFrameCoords.x,
          lifeBarFrameCoords.y,
          Const.LIFE_BAR_FRAME_WIDTH,
          Const.LIFE_BAR_FRAME_HEIGHT
        );

        //draws life bar with current health points
        this.context.drawImage(
          lifeBar,
          clippingPositionX,
          SpriteSheet.LIFE_BAR.y,
          healthPoints * lifeBarPoints,
          SpriteSheet.SPRITE_SIZE,
          lifeBarCoordX,
          Const.LIFE_BAR_1_COORDS.y,
          healthPoints * Const.LIFE_BAR_POINT,
          Const.LIFE_BAR_HEIGHT
        );

      }
    }

    drawDefenseObject(){
      let image: HTMLImageElement = new Image();
      let defendObjectPosition: {x: number, y: number};
      let clippingPosition: {x: number, y: number};
      let playerStates = this.gameState.getPlayerStates();

      for(var i = 0; i < playerStates.length; i++) {
        let playerState = this.gameState.getPlayerState(i);
        if(playerState.getIsDefending()){
          defendObjectPosition = {x: playerState.getX() - Const.DEFENSE_X_DIFF, y: playerState.getY() - Const.DEFENSE_Y_DIFF}
          clippingPosition = playerState.getIsInTheAir() ? SpriteSheet.DEFENSE_AIR : SpriteSheet.DEFENSE_GROUND;
          image = this.sharedSpriteSheet;

          ({ image, clippingPosition } = this.animateHitDefense(playerState));

          this.drawSquareImage(
            image,
            clippingPosition,
            defendObjectPosition,
            Const.DEFENSE_SIZE
          );
        }
      }
    }

    drawShootObject(){
      let shootObject: HTMLImageElement = new Image(),
          playerStates = this.gameState.getPlayerStates(),
          postion: {x: number, y: number};

      for(var i = 0; i < playerStates.length; i++) {
        let playerState = this.gameState.getPlayerState(i);

        if(playerState.getIsShooting()){

          shootObject = playerState.getId() === 1 ? this.player_1_sprites : this.player_2_sprites;
          postion = {x: playerState.getShootActionStateX(), y: playerState.getShootActionStateY()};
          this.drawSquareImage(
            shootObject,
            SpriteSheet.SHOOT,
            postion,
            Const.SHOOT_OBJECT_SIZE
          );
        }
      }
    }

    drawTarget(){
        let playerStates = this.gameState.getPlayerStates(),
          target: HTMLImageElement = new Image();

        for (var i = 0; i < playerStates.length; i++){
          let playerState = this.gameState.getPlayerState(i);

          target = playerState.getId() === 1 ? this.player_1_sprites : this.player_2_sprites;

          this.drawSquareImage(
            target,
            SpriteSheet.TARGET,
            {x: playerState.getCursorX(), y: playerState.getCursorY()},
            Const.SHOOT_OBJECT_SIZE
          );
        }
    }

    drawPlayer(){
      let character: HTMLImageElement = new Image(),
          clippingPosition: {x: number, y: number},
          playerStates = this.gameState.getPlayerStates();

      for (var i = 0; i < playerStates.length; i++){
        let playerState = this.gameState.getPlayerState(i);

        //use different image for each player
        character = playerState.getId() === 1 ? this.player_1_sprites : this.player_2_sprites;

        //use shooting player if he's shooting
        clippingPosition = playerState.getIsShooting() ? SpriteSheet.PLAYER_SHOOTING : playerState.getClippingPosition();

        if(playerState.getWasHit()){
          this.wasHitTime = {time: Date.now(), player_id: playerState.getId()};
        }

        if(Date.now() < this.wasHitTime.time + Const.ANIMATION_TIME && playerState.getId() === this.wasHitTime.player_id){
          clippingPosition = SpriteSheet.PLAYER_HIT;
        }

        //draws player image in the right state
        this.drawSquareImage(
          character,
          clippingPosition,
          {x: playerState.getX(), y: playerState.getY()},
          Const.PLAYER_WIDTH
        );
      }
    }

    drawClouds(){
      if (Const.WITH_GRID){
        let preBlock: number;
        let clippingPosition: {x: number, y: number};

        //scan only in possible block positions
        for (let i : number = Const.MAX_BLOCK_POSITION_Y; i < Const.MIN_BLOCK_POSITION_Y; i++){
          preBlock = 0;
          for (let j : number = 0; j < Const.GRID_WIDTH; j++){
            //Front/Left: preblock = 0 and now = 1
            if (preBlock === 0 && this.grid[i][j] === 1){
              clippingPosition = SpriteSheet.CLOUD_LEFT;
            }
            //Middle: preblock = 1, now = 1 and next = 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] === 1){
              clippingPosition = SpriteSheet.CLOUD_MIDDLE;
            }
            //Back/Right: preblock = 1, now = 0 and next != 1
            if(preBlock === 1 && this.grid[i][j] === 1 && this.grid[i][j+1] !==1){
              clippingPosition = SpriteSheet.CLOUD_RIGHT;
            }

            if(this.grid[i][j] === 1){
              this.drawSquareImage(
                this.sharedSpriteSheet,
                clippingPosition,
                {x: Const.BLOCK_WIDTH * j, y: Const.BLOCK_HEIGHT * i},
                Const.BLOCK_HEIGHT
              );
            }
            //previous block is now current block
            preBlock = this.grid[i][j];

          }
        }
      }
    }

    drawBackground(){
      this.drawScreen(SpriteSheet.BACKGROUND);
    }

    drawForeground(){
      this.context.drawImage(
        this.screens,
        SpriteSheet.FOREGROUND.x,
        SpriteSheet.FOREGROUND.y,
        Const.CANVAS_WIDTH,
        Const.FOREGROUND_HEIGHT,
        0,
        Const.CANVAS_HEIGHT - Const.FOREGROUND_HEIGHT,
        Const.CANVAS_WIDTH,
        Const.FOREGROUND_HEIGHT
        );
    }

    drawWinnerScreen(playerId:number){
      let winner : HTMLImageElement = new Image();
      winner = playerId === 1 ? this.player_1_sprites : this.player_2_sprites;

      //draws background screen for winner
      this.drawScreen(SpriteSheet.WINNER_SCREEN);

      //draws winner profile picture on winner screen
      this.drawSquareImage(
        winner,
        SpriteSheet.WINNER,
        Const.GAMEOVER_WINNER,
        Const.GAMEOVER_WINNER_SIZE
      );
    }

    drawLoserScreen(playerId:number){
      let loser: HTMLImageElement = new Image();
      loser = playerId === 1 ? this.player_1_sprites : this.player_2_sprites;

      //draws background screen for loser
      this.drawScreen(SpriteSheet.LOSER_SCREEN);

      //draws loser profile picture on loser screen
      this.drawSquareImage(
        loser,
        SpriteSheet.LOSER,
        Const.GAMEOVER_LOSER,
        Const.GAMEOVER_LOSER_SIZE
      );
    }

    //set start time of animation and image to use for animation
    private animateHitDefense(playerState: PlayerState) {
      if (playerState.getWasProtected()) {
        this.wasProtectedTime = { time: Date.now(), player_id: playerState.getId() };
      }
      if (Date.now() < this.wasProtectedTime.time + Const.ANIMATION_TIME && playerState.getId() === this.wasProtectedTime.player_id) {
        let image: HTMLImageElement = playerState.getId() === 1 ? this.player_1_sprites : this.player_2_sprites;
        let clippingPosition = playerState.getIsInTheAir() ? SpriteSheet.HIT_DEFENSE_AIR : SpriteSheet.HIT_DEFENSE_GROUND;
        return { image, clippingPosition };
      }
    }

    //help function to reduce length of draw functions for screens/background with the same canvas width and heigth
    private drawScreen(clippingPosition: {x: number, y: number}){
      this.context.drawImage(
        this.screens,
        clippingPosition.x,
        clippingPosition.y,
        Const.CANVAS_WIDTH,
        Const.CANVAS_HEIGHT,
        0,
        0,
        Const.CANVAS_WIDTH,
        Const.CANVAS_HEIGHT
      )
    }

    //help function to reduce length of draw functions for objects with height = width
    private drawSquareImage(image: HTMLImageElement, clippingPosition: {x: number, y: number}, position: {x: number, y: number}, size: number){
      this.context.drawImage(
        image,
        clippingPosition.x * SpriteSheet.SPRITE_SIZE,
        clippingPosition.y * SpriteSheet.SPRITE_SIZE,
        SpriteSheet.SPRITE_SIZE,
        SpriteSheet.SPRITE_SIZE,
        position.x,
        position.y,
        size,
        size
      );
    }
}
