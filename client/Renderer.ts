import { GlobalConstants as Const } from "../global/GlobalConstants";
import { SpriteSheet } from "../global/SpriteSheet";
import { GameState } from "../global/GameState";
import { PlayerState } from "../global/PlayerState";

export class Renderer {
    private context: CanvasRenderingContext2D;
    private sharedSpriteSheet: HTMLImageElement = new Image();
    private player_1_sprites: HTMLImageElement = new Image();
    private player_2_sprites: HTMLImageElement = new Image();
    private screens: HTMLImageElement = new Image();
    private grid: Array<Array<number>> = Const.GRID_1;
    private gameState: GameState = new GameState();
    private wasProtectedTime: {time: number, playerId: number} = {time: 0, playerId: Const.ID_INITIAL_STATE};
    private wasHitTime: {time: number, playerId: number} = {time: 0, playerId: Const.ID_INITIAL_STATE};

    constructor(gameState: GameState, context: CanvasRenderingContext2D){
        //Load all images
        this.sharedSpriteSheet.src = `./${Const.ASSET_FOLDER}SpriteSheet_Shared.png`;
        this.player_1_sprites.src = `./${Const.ASSET_FOLDER}SpriteSheet_Player_1.png`;
        this.player_2_sprites.src = `./${Const.ASSET_FOLDER}SpriteSheet_Player_2.png`;
        this.screens.src = `./${Const.ASSET_FOLDER}Screens.png`;
        this.context = context;
        this.gameState = gameState;
    }

    drawGameState(playerId: number){
      //draw actual game
      this.drawGame();

      if((this.gameState.gameOver === true) && this.gameState.getWinnerId() === Const.WINNER_INITIAL_STATE){
        this.drawStartScreen(playerId);
      }

      if(this.gameState.winnerIsCalculated()){
        this.drawGameOverScreen(playerId);
      }
    }

    private drawGame(){
        this.context.clearRect(0, 0, Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);
        this.drawBackground();
        this.drawTimer();
        this.drawPlayer();
        this.drawShootObject();
        this.drawDefenseObject();
        this.drawClouds();
        this.drawTarget();
        this.drawLifeBar();
        this.drawForeground();
    }

    private drawStartScreen(playerId: number){
      let image : HTMLImageElement = new Image(),
        clippingPosition: {x: number, y: number};

      //draw start screen background
      this.drawScreen(SpriteSheet.START_SCREEN);

      clippingPosition = this.gameState.playersReadyToStartGame[playerId] ? SpriteSheet.PLAYER_READY : SpriteSheet.PLAYER_NOT_READY;
      //draw ready state circle around profile picture
      this.drawSquareImage(this.sharedSpriteSheet, clippingPosition, Const.READY_STATE_POSITION, Const.READY_STATE_SIZE);

      image = playerId === 1 ? this.player_1_sprites : this.player_2_sprites;
      //draw profile picture
      this.drawSquareImage(image, SpriteSheet.PROFILPICTURE, Const.PROFILE_PICTURE_POSITION, Const.PROFILE_PICTURE_SIZE);
    }

    private drawGameOverScreen(playerId: number){
      let winnerId: number = this.gameState.getWinnerId();
        if(playerId === winnerId){
          this.drawWinnerScreen(playerId);
        } else if(winnerId === Const.GAMEOVER_DRAW){
          this.drawNoWinnerScreen();
        } else {
          this.drawLoserScreen(playerId);
        }
    }

    private drawTimer(){
      let end_angle = (2*(this.gameState.timeLeft / Const.COUNTDOWN) - 0.5)*Math.PI;
      this.context.beginPath();
      this.context.arc(Const.TIMER_X, Const.TIMER_Y, Const.TIMER_RADIUS, Const.START_ANGLE, end_angle);
      this.context.lineTo(Const.TIMER_X, Const.TIMER_Y);
      this.context.lineTo(Const.TIMER_X, Const.TIMER_Y - Const.BLOCK_HEIGHT);
      this.context.fillStyle = Const.TIMER_COLOR;
      this.context.fill();
    }

    private drawLifeBarFrame(image: HTMLImageElement, playerState: PlayerState){
      let positionCoords = playerState.getId() === 1 ? Const.LIFE_BAR_FRAME_1_COORDS : Const.LIFE_BAR_FRAME_2_COORDS;

      //draws life bar frame
      this.context.drawImage(
        image,
        SpriteSheet.LIFE_BAR_FRAME.x,
        SpriteSheet.LIFE_BAR_FRAME.y,
        image.width,
        SpriteSheet.SPRITE_SIZE,
        positionCoords.x,
        positionCoords.y,
        Const.LIFE_BAR_FRAME_WIDTH,
        Const.LIFE_BAR_FRAME_HEIGHT
      );
    }

    private drawHealthPoints(image: HTMLImageElement, playerState: PlayerState){
      let lifeBarCoordX: number,
        clippingPositionX: number,
        healthPoints = playerState.getHealthPoints(),
        lostHealthPoints = Const.MAX_HP - healthPoints,
        oneHealthPointWidth = (SpriteSheet.SPRITES_IN_ROW * SpriteSheet.SPRITE_SIZE) / Const.MAX_HP;

      if(playerState.getId() === 1){
        clippingPositionX = SpriteSheet.LIFE_BAR.x;
        lifeBarCoordX = Const.LIFE_BAR_1_COORDS.x;
      }else{
        clippingPositionX = SpriteSheet.LIFE_BAR.x + (lostHealthPoints * oneHealthPointWidth);
        lifeBarCoordX = Const.LIFE_BAR_2_COORDS.x + (lostHealthPoints * Const.LIFE_BAR_POINT);
      }
      //draws life bar with current health points
      this.context.drawImage(
        image,
        clippingPositionX,
        SpriteSheet.LIFE_BAR.y,
        healthPoints * oneHealthPointWidth,
        SpriteSheet.SPRITE_SIZE,
        lifeBarCoordX,
        Const.LIFE_BAR_1_COORDS.y,
        healthPoints * Const.LIFE_BAR_POINT,
        Const.LIFE_BAR_HEIGHT
      );
    }

    private drawLifeBar(){
      let playerStates = this.gameState.getPlayerStates();

      for(let i = 0; i < playerStates.length; i++) {
        let playerState = this.gameState.getPlayerState(i);
        let image = this.getPlayerSpriteById(playerState.getId());

        this.drawLifeBarFrame(image, playerState);
        this.drawHealthPoints(image, playerState);
      }
    }

    private drawDefenseObject(){
      let image: HTMLImageElement = new Image();
      let defendObjectPosition: {x: number, y: number};
      let clippingPosition: {x: number, y: number};
      let playerStates = this.gameState.getPlayerStates();

      for (let i = 0; i < playerStates.length; i++) {
        let playerState = this.gameState.getPlayerState(i);
        if (playerState.getIsDefending()) {
          defendObjectPosition = {x: playerState.getX() - Const.DEFENSE_X_DIFF, y: playerState.getY() - Const.DEFENSE_Y_DIFF}
          clippingPosition = playerState.getIsInTheAir() ? SpriteSheet.DEFENSE_AIR : SpriteSheet.DEFENSE_GROUND;
          image = this.sharedSpriteSheet;

          if (playerState.getWasProtected()) {
            this.wasProtectedTime = { time: Date.now(), playerId: playerState.getId() };
          }
          if (Date.now() < this.wasProtectedTime.time + Const.ANIMATION_TIME && playerState.getId() === this.wasProtectedTime.playerId) {
            image = this.getPlayerSpriteById(playerState.getId());
            clippingPosition = playerState.getIsInTheAir() ? SpriteSheet.HIT_DEFENSE_AIR : SpriteSheet.HIT_DEFENSE_GROUND;
          }

          this.drawSquareImage(
            image,
            clippingPosition,
            defendObjectPosition,
            Const.DEFENSE_SIZE
          );
        }
      }
    }

    private drawShootObject(){
      let playerStates = this.gameState.getPlayerStates(),
          position: {x: number, y: number};

      for(let i = 0; i < playerStates.length; i++) {
        let playerState = this.gameState.getPlayerState(i);

        if(playerState.getIsShooting()){
          let image = this.getPlayerSpriteById(playerState.getId());
          position = {x: playerState.getShootActionStateX(), y: playerState.getShootActionStateY()};

          this.drawSquareImage(
            image,
            SpriteSheet.SHOOT,
            position,
            Const.SHOOT_OBJECT_SIZE
          );
        }
      }
    }

    private drawTarget(){
        let playerStates = this.gameState.getPlayerStates();

        for (let i = 0; i < playerStates.length; i++){
          let playerState = this.gameState.getPlayerState(i);
          let image = this.getPlayerSpriteById(playerState.getId());

          this.drawSquareImage(
            image,
            SpriteSheet.TARGET,
            {x: playerState.getCursorX(), y: playerState.getCursorY()},
            Const.SHOOT_OBJECT_SIZE
          );
        }
    }

    private drawPlayer(){
      let image: HTMLImageElement = new Image(),
          clippingPosition: {x: number, y: number},
          playerStates = this.gameState.getPlayerStates();

      for (let i = 0; i < playerStates.length; i++){
        let playerState = this.gameState.getPlayerState(i),
            playerPosition = {x: playerState.getX(), y: playerState.getY()};

        //use different image for each player
        image = this.getPlayerSpriteById(playerState.getId());

        //use shooting player if he's shooting
        clippingPosition = playerState.getIsShooting() ? SpriteSheet.PLAYER_SHOOTING : playerState.getClippingPosition();

        if(playerState.getWasHit()){
          this.wasHitTime = {time: Date.now(), playerId: playerState.getId()};
        }

        if(Date.now() < this.wasHitTime.time + Const.ANIMATION_TIME && playerState.getId() === this.wasHitTime.playerId){
          clippingPosition = SpriteSheet.PLAYER_HIT;
        }

        //draws player image in the right state
        this.drawSquareImage(image, clippingPosition, playerPosition, Const.PLAYER_WIDTH);
      }
    }

    private drawClouds(){
      if (Const.WITH_GRID){
        let preBlock: number;
        let clippingPosition: {x: number, y: number};

        //scan only in possible block positions
        for (let i = Const.MAX_BLOCK_POSITION_Y; i < Const.MIN_BLOCK_POSITION_Y; i++){
          preBlock = 0;
          for (let j = 0; j < Const.GRID_WIDTH; j++){
            let gridPosition = {x: Const.BLOCK_WIDTH * j, y: Const.BLOCK_HEIGHT * i};

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
              this.drawSquareImage(this.sharedSpriteSheet, clippingPosition, gridPosition, Const.BLOCK_HEIGHT);
            }
            //previous block is now current block
            preBlock = this.grid[i][j];

          }
        }
      }
    }

    private drawBackground(){
      if(Const.SOLID_GROUND){
        this.drawScreen(SpriteSheet.BACKGROUND);
      } else {
        this.drawScreen(SpriteSheet.HEAVEN);
      }
    }

    private drawForeground(){
      if(Const.SOLID_GROUND){
        this.context.drawImage(
          this.screens,
          SpriteSheet.FOREGROUND.x,
          SpriteSheet.FOREGROUND.y * Const.CANVAS_HEIGHT,
          Const.CANVAS_WIDTH,
          Const.FOREGROUND_HEIGHT,
          0,
          Const.CANVAS_HEIGHT - Const.FOREGROUND_HEIGHT,
          Const.CANVAS_WIDTH,
          Const.FOREGROUND_HEIGHT
          );
      }
    }

    private drawWinnerScreen(playerId:number){
      let image = this.getPlayerSpriteById(playerId);

      //draws background screen for winner
      this.drawScreen(SpriteSheet.WINNER_SCREEN);

      //draws winner profile picture on winner screen
      this.drawSquareImage(image, SpriteSheet.WINNER, Const.GAMEOVER_WINNER, Const.GAMEOVER_WINNER_SIZE);
    }

    private drawLoserScreen(playerId:number){
      let image = this.getPlayerSpriteById(playerId);

      //draws background screen for loser
      this.drawScreen(SpriteSheet.LOSER_SCREEN);

      //draws loser profile picture on loser screen
      this.drawSquareImage(image, SpriteSheet.LOSER, Const.GAMEOVER_LOSER, Const.GAMEOVER_LOSER_SIZE);
    }

    private drawNoWinnerScreen(){
      this.drawScreen(SpriteSheet.DRAW_SCREEN);
    }

    private getPlayerSpriteById(playerId: number){
      return playerId === 1 ? this.player_1_sprites : this.player_2_sprites;
    }

    //help function to reduce length of draw functions for screens/background with the same canvas width and heigth
    private drawScreen(clippingPosition: {x: number, y: number}){
      this.context.drawImage(
        this.screens,
        clippingPosition.x,
        clippingPosition.y * Const.CANVAS_HEIGHT,
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
