import { GlobalConstants as Const } from "../global/GlobalConstants"
import { SpriteSheet } from "../global/SpriteSheet"
import { CollisionDetection } from './CollisionDetection'
import { ShootAction } from "./ShootAction";
import { DynamicObject }  from "./DynamicObject";


export class Player extends DynamicObject {
    //Attributes of the player
    private id: number = 0;
    private cursorX: number;
    private cursorY: number;
    private healthPoints: number = Const.MAX_HP;
    private wasProtected: boolean = false;
    private wasHit: boolean = false;
    private isReadyToStartGame: boolean = false;

    //Actions the player can make
    private isUpKeyPressed : boolean = false;
    private isLeftKeyPressed : boolean = false;
    private isDownKeyPressed : boolean = false;
    private isRightKeyPressed : boolean = false;
    private isJumping : boolean = false;

    private isShooting : boolean = false;
    private shootAction: ShootAction;
    private isDefending: boolean = false;

    constructor(id :number){
        super(0, 0);
        this.id = id;

        this.setInitialPlayerPosition();
    }

    updatePlayerState(){
        this.checkJump();
        this.updateVelocities();
        this.updatePosition();
        this.updateShootObject();
        this.checkCursorPosition();
        this.checkVerticalBoundaries();
        this.checkHorizontalBoundaries();
        CollisionDetection.handleBlockCollision(this);
    }

    //update position after new setted velocities
    updatePosition(){
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    //Check if jumping is allowed
    checkJump(){
      if (this.isUpKeyPressed && this.isJumping == false){
          this.velocityY -= Const.JUMP_HEIGHT;
          this.isJumping = true;
          console.log(`Player ${this.id} is jumping with velocityY: ${this.velocityY}`);
      }
    }

    checkVerticalBoundaries(){
        //-> Level Setting: SOLID_GROUND
        //Player cannot fall through the platform
        if (this.y > Const.GROUND_HEIGHT_FROM_TOP && Const.SOLID_GROUND){
            this.standOnGround();  
        }
        //Player can fall and come back from top
        if(this.y > Const.CANVAS_HEIGHT && !Const.SOLID_GROUND){
            this.y = -Const.PLAYER_HEIGHT;
        }

        //-> Level Setting: SOLID_ROOF
        if (Const.SOLID_ROOF && this.isJumping){
            this.solidRoof();
        }
    }

    checkHorizontalBoundaries(){
        //-> Level Setting: SOLID_WALLS
        if (Const.SOLID_WALLS){
            //When Canvas ends in x axis, player stops the sides of canvas
            this.solidWalls();

        } else {
            //When player runs to one end of the canvas, he pops out on the other side
            this.permeableWalls();
        }
    }

    standOnGround(){
        this.isJumping = false;
        this.y = Const.GROUND_HEIGHT_FROM_TOP;
        this.velocityY = 0;
    }

    //Update shoot object position
    updateShootObject(){
        if(this.isShooting){
            if(this.shootAction.getIsShootActionComplete() && this.shootAction !== undefined){
                this.isShooting = false;
            }

            this.shootAction.updateShootActionStatePosition();
        }
    }

    updateVelocities(){
        //Change the speed depending on the input
        if(this.isRightKeyPressed){
            this.velocityX += Const.ACCELERATION_X;
        }
        if(this.isLeftKeyPressed){
            this.velocityX -= Const.ACCELERATION_X;
        }
        if(this.isDownKeyPressed){
            this.velocityY += 2*Const.ACCELERATION_Y;
        }

        //Add physics
        this.velocityY += Const.GRAVITATION;
        this.velocityX *= Const.FRICTION;
        this.velocityY *= Const.FRICTION;
    }

    solidRoof(){
        //Player cannot jump higher than the canvas height
        let setValueTo: number;
        setValueTo = this.isDefending ? Const.DEFENSE_Y_DIFF : 0;
        if(this.y < setValueTo){
            this.y = setValueTo;
            this.velocityY = 0;
        }

    }

    permeableWalls(){
        //When the player runs to one end of the canvas, he pops out on the other side
        if (this.x < (-1 * Const.PLAYER_WIDTH)){
            this.x = Const.CANVAS_WIDTH;
        }
        if (this.x > Const.CANVAS_WIDTH){
            this.x = -1 * Const.PLAYER_WIDTH;
        }
    }

    solidWalls(){
        //Player cannot pass the walls on either side
        let additionalWidth = this.isDefending ? Const.DEFENSE_X_DIFF : 0 ;
            if(this.x < additionalWidth) {
                this.x = additionalWidth;
            }
            if(this.x > Const.CANVAS_WIDTH - Const.PLAYER_WIDTH - additionalWidth){
                this.x = Const.CANVAS_WIDTH - Const.PLAYER_WIDTH - additionalWidth;
            }
    }

    //Target can only be positioned within walls and above ground
    //Set cursor positions within walls
    checkCursorPosition(){
        if(this.cursorX > Const.CANVAS_WIDTH - Const.TARGET_SIZE){
            this.cursorX = Const.CANVAS_WIDTH - Const.TARGET_SIZE;
        }
        if(this.cursorX < 0){
            this.cursorX = 0;
        }
        if(this.cursorY < 0){
            this.cursorY = 0;
        }
        if(this.cursorY > Const.GROUND_HEIGHT_Y - Const.TARGET_SIZE){
            this.cursorY = Const.GROUND_HEIGHT_Y - Const.TARGET_SIZE;
        }
    }

    //Determine which image sprite will be rendered
    checkLookingDirection(){
        if(this.isLeftKeyPressed){
            return SpriteSheet.PLAYER_LEFT;
        }
        if(this.isLeftKeyPressed == false && this.isRightKeyPressed == false){
            return SpriteSheet.PLAYER_FRONT;
        }
        if(this.isRightKeyPressed){
            return SpriteSheet.PLAYER_RIGHT;
        }
    }

    resetPlayer(){
        this.setHealthPoints(Const.MAX_HP);
        this.setIsReadyToStartGame(false);
        this.resetActions();
        this.setInitialPlayerPosition();
    }

    setInitialPlayerPosition(){
        if(this.getId() === 1){
            this.setX(Const.PLAYER_1_START_X_COORDS);
          }else{
            this.setX(Const.PLAYER_2_START_X_COORDS);
          }
  
        this.setY(-Const.PLAYER_WIDTH);
    }

    resetActions(){
        this.isUpKeyPressed = false;
        this.isDownKeyPressed = false;
        this.isLeftKeyPressed = false;
        this.isRightKeyPressed = false;
        this.isDefending = false;
        this.isShooting = false;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    //Getter Methods
    getCursorX(){
        return this.cursorX;
    }
    getCursorY(){
        return this.cursorY;
    }

    getId(){
        return this.id;
    }

    getIsUpKeyPressed(){
        return this.isUpKeyPressed;
    }

    getIsLeftKeyPressed(){
        return this.isLeftKeyPressed;
    }

    getIsDownKeyPressed(){
        return this.isDownKeyPressed;
    }

    getIsRightKeyPressed(){
        return this.isRightKeyPressed;
    }

    getIsShooting(){
        return this.isShooting;
    }

    getIsDefending(){
        return this.isDefending;
    }

    getWasProtected() {
        return this.wasProtected;
    }

    getWasHit(){
        return this.wasHit;
    }

    getIsInTheAir(){
        return this.velocityY === 0 ? false : true ;
    }

    getShootAction(){
        return this.shootAction;
    }

    getShootActionX(){
        return this.shootAction.getX();
    }

    getShootActionY(){
        return this.shootAction.getY();
    }

    getVelocityX(){
        return this.velocityX;
    }

    getVelocityY(){
        return this.velocityY;
    }

    getHealthPoints(){
        return this.healthPoints;
    }

    getIsReadyToStartGame(){
        return this.isReadyToStartGame;
    }


    //Setter Methods
    setHealthPoints(healthPoints: number){
        this.healthPoints = healthPoints;
    }

    setCursorPosition(cursorX: number, cursorY: number){
        this.cursorX = cursorX;
        this.cursorY = cursorY;
    }

    setShootAction(isShooting : boolean){
        this.isShooting = isShooting;

        if ( isShooting ) {
          this.shootAction = new ShootAction(
              this.x,
              this.y,
              this.cursorX,
              this.cursorY
              );
      } else {
        this.shootAction = undefined;
      }
    }

    setIsDefending(isDefending: boolean){
        this.isDefending = isDefending;
    }

    setWasProtected(wasProtected: boolean){
        this.wasProtected = wasProtected;
    }

    setWasHit(wasHit: boolean){
        this.wasHit = wasHit;
    }
    setIsUpKeyPressed(isUpKeyPressed : boolean){
        this.isUpKeyPressed = isUpKeyPressed;
    }

    setIsLeftKeyPressed(isLeftKeyPressed : boolean){
        this.isLeftKeyPressed = isLeftKeyPressed;
    }

    setIsDownKeyPressed(isDownKeyPressed : boolean){
        this.isDownKeyPressed = isDownKeyPressed;
    }

    setIsRightKeyPressed(isRightKeyPressed : boolean){
        this.isRightKeyPressed = isRightKeyPressed;
    }

    setIsJumping(isJumping : boolean){
        this.isJumping = isJumping;
    }

    setY(y : number){
        this.y = y;
    }

    setX(x : number){
        this.x = x;
    }

    setVelocityY(velocityY : number){
        this.velocityY = velocityY;
    }

    setVelocityX(velocityX : number){
        this.velocityX = velocityX;
    }

    setIsReadyToStartGame(isReady: boolean){
        this.isReadyToStartGame = isReady;
    }

}
