import { GlobalConstants as Const } from "../global/GlobalConstants"
import { SpriteSheet } from "../global/SpriteSheet"
import { GameState } from "../global/GameState"

export class Renderer {
    private context: CanvasRenderingContext2D;
    private sharedSpriteSheet: HTMLImageElement = new Image();
    private player_1_sprites: HTMLImageElement = new Image();
    private player_2_sprites: HTMLImageElement = new Image();
    private screens: HTMLImageElement = new Image();
    private grid: Array<Array<number>> = [];
    private gameState: GameState = new GameState();
    private wasProtectedTime: {time: number, player_id: number};
    private wasHitTime: {time: number, player_id: number};

    constructor(gameState: GameState, context: CanvasRenderingContext2D){
        //Load all images
        this.sharedSpriteSheet.src = `./${Const.ASSET_FOLDER}SpriteSheet_Shared.png`;
        this.player_1_sprites.src = `./${Const.ASSET_FOLDER}SpriteSheet_Player_1.png`;
        this.player_2_sprites.src = `./${Const.ASSET_FOLDER}SpriteSheet_Player_2.png`;
        this.screens.src = `./${Const.ASSET_FOLDER}Screens.png`
        this.wasHitTime = {time: 0, player_id: -1};
        this.wasProtectedTime = {time: 0, player_id: -1};
        this.grid = Const.GRID_1;
        this.context = context;
        this.gameState = gameState;
    }

    draw(gameState: GameState){
        this.gameState = gameState;
        this.context.clearRect(0, 0, Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);
        this.drawBackground();
        this.drawSunTimer();
        this.drawPlayer();
        this.drawDefendObject();
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

        this.context.fillStyle = "#F5A9AF";
        this.context.fill();
      }

    //TODO: geht bestimmt kürzer! Sonst eine Hilfsmethode auslagern
    drawLifeBar(){
      let lifeBar: HTMLImageElement = new Image();
      let lifeBarFrameCoords: {x: number, y: number};
      let lifeBarCoordX: number;
      let clippingPositionX: number;
      let healthPoints: number;
      let lifeBarWidth: number = this.player_1_sprites.width;
      let lifeBarPoints: number = lifeBarWidth / Const.MAX_HP;
      let playerStates = this.gameState.getPlayerStates();

        for(var i = 0; i < playerStates.length; i++) {
          let playerState = this.gameState.getPlayerState(i);
          healthPoints = playerState.getHealthPoints();

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

    drawDefendObject(){
        let usedImage: HTMLImageElement = new Image();
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
            usedImage = this.sharedSpriteSheet;

            if(playerState.getWasProtected()){
              this.wasProtectedTime = {time: Date.now(), player_id: playerState.getId()};
            }

            if(Date.now() < this.wasProtectedTime.time + Const.ANIMATION_TIME && playerState.getId() === this.wasProtectedTime.player_id){
              usedImage = playerState.getId() === 1 ? this.player_1_sprites : this.player_2_sprites;
              clippingPosition = playerState.getIsInTheAir() ? SpriteSheet.HIT_DEFENSE_AIR : SpriteSheet.HIT_DEFENSE_GROUND;
            }

            this.context.drawImage(
              usedImage,
              clippingPosition.x,
              clippingPosition.y,
              SpriteSheet.SPRITE_SIZE,
              SpriteSheet.SPRITE_SIZE,
              defendObject_X,
              defendObject_Y,
              Const.DEFENSE_SIZE,
              Const.DEFENSE_SIZE
            );

          }
        }
    }

    drawShootObject(){
        let shootObject: HTMLImageElement = new Image(),
            playerStates = this.gameState.getPlayerStates();

        for(var i = 0; i < playerStates.length; i++) {
          let playerState = this.gameState.getPlayerState(i);

          if(playerState.getIsTakingAction()){

            shootObject = playerState.getId() === 1 ? this.player_1_sprites : this.player_2_sprites;

            this.context.drawImage(
              shootObject,
              SpriteSheet.SHOOT.x,
              SpriteSheet.SHOOT.y,
              SpriteSheet.SPRITE_SIZE,
              SpriteSheet.SPRITE_SIZE,
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
            SpriteSheet.TARGET.x,
            SpriteSheet.TARGET.y,
            SpriteSheet.SPRITE_SIZE,
            SpriteSheet.SPRITE_SIZE,
            playerState.getCursorX(),
            playerState.getCursorY(),
            Const.SHOOT_OBJECT_SIZE,
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
          clippingPosition = playerState.getIsTakingAction() ? SpriteSheet.PLAYER_SHOOTING : playerState.getClippingPosition();

          //TODO: Was wenn beide fast zur gleichen Zeit getroffen wurden?
          if(playerState.getWasHit()){
            this.wasHitTime = {time: Date.now(), player_id: playerState.getId()};
          }

          if(Date.now() < this.wasHitTime.time + Const.ANIMATION_TIME && playerState.getId() === this.wasHitTime.player_id){
            clippingPosition = SpriteSheet.PLAYER_HIT;
          }

          //draws player image in the right state
          this.context.drawImage(
            character,
            clippingPosition.x,
            clippingPosition.y,
            SpriteSheet.SPRITE_SIZE,
            SpriteSheet.SPRITE_SIZE,
            playerState.getX(),
            playerState.getY(),
            Const.PLAYER_WIDTH,
            Const.PLAYER_HEIGHT,
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
                this.context.drawImage(
                  this.sharedSpriteSheet,
                  clippingPosition.x,
                  clippingPosition.y,
                  SpriteSheet.SPRITE_SIZE,
                  SpriteSheet.SPRITE_SIZE,
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
        this.context.drawImage(
            this.screens,
            SpriteSheet.BACKGROUND.x,
            SpriteSheet.BACKGROUND.y,
            Const.CANVAS_WIDTH,
            Const.CANVAS_HEIGHT,
            0,
            0,
            Const.CANVAS_WIDTH,
            Const.CANVAS_HEIGHT);
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
        this.context.drawImage(
          this.screens,
          SpriteSheet.WINNER_SCREEN.x,
          SpriteSheet.WINNER_SCREEN.y,
          Const.CANVAS_WIDTH,
          Const.CANVAS_HEIGHT,
          0,
          0,
          Const.CANVAS_WIDTH,
          Const.CANVAS_HEIGHT
        )

        //draws winner profilpicture on winner screen
        this.context.drawImage(
          winner,
          SpriteSheet.WINNER.x,
          SpriteSheet.WINNER.y,
          SpriteSheet.SPRITE_SIZE,
          SpriteSheet.SPRITE_SIZE,
          Const.GAMEOVER_WINNER_X,
          Const.GAMEOVER_WINNER_Y,
          Const.GAMEOVER_WINNER_SIZE,
          Const.GAMEOVER_WINNER_SIZE
        )
      }

      drawLoserScreen(playerId:number){
        let loser: HTMLImageElement = new Image();
        loser = playerId === 1 ? this.player_1_sprites : this.player_2_sprites;

        //draws background screen for loser
        this.context.drawImage(
          this.screens,
          SpriteSheet.LOSER_SCREEN.x,
          SpriteSheet.LOSER_SCREEN.y,
          Const.CANVAS_WIDTH,
          Const.CANVAS_HEIGHT,
          0,
          0,
          Const.CANVAS_WIDTH,
          Const.CANVAS_HEIGHT
        )

        //draws loser profilpicture on loser screen
        this.context.drawImage(
          loser,
          SpriteSheet.LOSER.x,
          SpriteSheet.LOSER.y,
          SpriteSheet.SPRITE_SIZE,
          SpriteSheet.SPRITE_SIZE,
          Const.GAMEOVER_LOSER_X,
          Const.GAMEOVER_LOSER_Y,
          Const.GAMEOVER_LOSER_SIZE,
          Const.GAMEOVER_LOSER_SIZE
        )
      }

}
