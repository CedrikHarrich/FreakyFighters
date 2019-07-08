import { GlobalConstants as Const } from "../global/GlobalConstants"
import { SpriteSheet } from "../global/SpriteSheet"
import { CollisionDetection } from './CollisionDetection'
import { ShootAction } from "./ShootAction";

export class Player {
    //Attributes of the player.
    private x : number = 0;
    private y : number = 0;
    private velocityX : number = 0;
    private velocityY : number = 0;
    private id :number = 0;
    private cursorX: number;
    private cursorY: number;
    private healthPoints: number;

    //Actions the player can make
    private isUpKeyPressed : boolean = false;
    private isLeftKeyPressed : boolean = false;
    private isDownKeyPressed : boolean = false;
    private isRightKeyPressed : boolean = false;
    private isJumping : boolean = false;

    private isTakingAction : boolean = false;
    private action: ShootAction;
    private isDefending: boolean = false;

    constructor(id :number){
        this.id = id;
        this.healthPoints = Const.MAX_HP - 2; //TODO: set back to Const.MAX_HP
        this.isTakingAction = false;
        if(this.id === 1){
            this.x = Const.PLAYER_1_START_X_COORDS;
        }else{
            this.x = Const.PLAYER_2_START_X_COORDS;
        }
    }

    updatePosition(){
        //Check if you can jump
        this.checkJump();

        this.updateVelocity();

        //Update the actual positon
        this.x += this.velocityX;
        this.y += this.velocityY;

        //Update Shoot Object Position
        if(this.isTakingAction){
            if(this.action.getIsActionComplete()){
                this.isTakingAction = false;
            }
            this.action.updateShootObjectPosition();
        }

        // Set Cursor Positions within walls
        this.checkCursorPosition();

        //Don't fall through the platform.
        if (this.y > Const.GROUND_HEIGHT_FROM_TOP){
            this.isJumping = false;
            this.y = Const.GROUND_HEIGHT_FROM_TOP;
            this.velocityY = 0;
        }

        //Level Setting: SolidWalls
        if (Const.SOLID_WALLS){
            //When Canvas stops in x axis, player stops too
            this.solidWalls();

        } else {
            //Player can run to the right and pops out on the left an vice versa.
            this.permeableWalls();
        }

        //Level Setting: SolidRoof
        if (Const.SOLID_ROOF){
            this.solidRoof();
        }

        CollisionDetection.handleCollision(this, Const.GRID_1);
    }

    checkJump(){
      if (this.isUpKeyPressed && this.isJumping == false){
          this.velocityY -= Const.JUMP_HEIGHT;
          this.isJumping = true;
          console.log(`Player ${this.id} is jumping with velocityY: ${this.velocityY}`);
      }
    }

    updateVelocity(){
      //Change the speed depending on the Input
      if (this.isRightKeyPressed){
          this.velocityX += Const.ACCELERATION_X;
      }
      if (this.isLeftKeyPressed){
          this.velocityX -= Const.ACCELERATION_X;
      }
      if (this.isDownKeyPressed){
          this.velocityY += 2*Const.ACCELERATION_Y;
      }

      //Add physics.
      this.velocityY += Const.GRAVITATION;
      this.velocityX *= Const.FRICTION;
      this.velocityY *= Const.FRICTION;
    }

    solidRoof(){
        //Don't jump over the canvas.
        let setValueTo: number;
        this.isDefending ? setValueTo = Const.DEFENSE_Y_DIFF : setValueTo = 0;
        if(this.y < setValueTo){
            this.y = setValueTo;
            this.velocityY = 0;
        }

    }

    permeableWalls(){
        //Player can run to the right and pops out on the left an vice versa.
        if (this.x < (-1 * Const.PLAYER_WIDTH)){
            this.x = Const.CANVAS_WIDTH;
        }
        if (this.x > Const.CANVAS_WIDTH){
            this.x = -1 * Const.PLAYER_WIDTH;
        }
    }

    solidWalls(){
        //Player can not pass the walls on each side.
        if(this.isDefending){
            if(this.x < Const.DEFENSE_X_DIFF) {
                this.x = Const.DEFENSE_X_DIFF
            }
            if(this.x > Const.CANVAS_WIDTH - Const.PLAYER_WIDTH - Const.DEFENSE_X_DIFF){
                this.x = Const.CANVAS_WIDTH - Const.PLAYER_WIDTH - Const.DEFENSE_X_DIFF;
            }
        } else {
            if (this.x < 0){
                this.x = 0;
            }
            if (this.x > Const.CANVAS_WIDTH - Const.PLAYER_WIDTH){
                this.x = Const.CANVAS_WIDTH - Const.PLAYER_WIDTH;
            }
        }

    }

    //Target can only be positioned within walls and above ground
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

    // determines which image sprite will be rendered
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

    //Getter Methods
    getX() : number{
        return this.x;
    }

    getY(){
        return this.y
    }

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

    getIsTakingAction(){
        return this.isTakingAction;
    }

    getIsDefending(){
        return this.isDefending;
    }

    getIsInTheAir(){
        return this.velocityY === 0 ? false : true ;
    }

    getAction(){
        return this.action;
    }

    getActionX(){
        return this.action.getX();
    }

    getActionY(){
        return this.action.getY();
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

    //Setter Methods
    setHealthpoints(healthPoints: number){
        this.healthPoints = healthPoints;
    }

    setCursorPosition(cursorX: number, cursorY: number){
        this.cursorX = cursorX;
        this.cursorY = cursorY;
    }

    setIsTakingAction(isTakingAction : boolean){
        this.isTakingAction = isTakingAction;
        this.action = new ShootAction(
            this.x,
            this.y,
            this.cursorX,
            this.cursorY
            );
    }

    setIsDefending(isDefending: boolean){
        this.isDefending = isDefending;
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

}
