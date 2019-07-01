import { GlobalConstants as Const } from "../global/GlobalConstants"
import { ShootAction } from "./ShootAction";

export class Player {
    //Attributes of the player.
    private x : number = 0;
    private y : number = 0;
    private velocityX : number = 0;
    private velocityY : number = 0;
    private id :number = 0;
    private cursor_X: number;
    private cursor_Y: number;
    private bubble_X : number;
    private bubble_Y : number;
    private kindOfAction : string;

    //Actions the player can make
    private isUpKeyPressed : boolean = false;
    private isLeftKeyPressed : boolean = false;
    private isDownKeyPressed : boolean = false;
    private isRightKeyPressed : boolean = false;
    private isJumping : boolean = false;
    private isDefending : boolean = false;

    private isTakingAction : boolean = false;
    private attack: any;

    

    //static readonly ASSET_FOLDER : string = "assets/"
    //this.block.src = `./${Const.ASSET_FOLDER}clouds.png`;
    constructor(id :number){
        this.id = id;
        this.isTakingAction = false;
        //Start Position depending on playerID
        this.id === 1 ? this.x = Const.PLAYER_1_START_X_COORDS : this.x = Const.PLAYER_2_START_X_COORDS;
        
    }

    updatePosition(){

        //Check if you can jump
        if (this.isUpKeyPressed && this.isJumping == false){
            this.velocityY -= Const.JUMP_HEIGHT;
            this.isJumping = true;
            console.log(`Player ${this.id} is jumping with velocityY: ${this.velocityY}`);
        }

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

        //Update the actual positon
        this.x += this.velocityX;
        this.y += this.velocityY;

        //Update Action
        if(this.isTakingAction){
            if(this.attack.getIsActionComplete()){
                this.isTakingAction = false;
            }else{
                this.attack.updateShootObjectPosition();
                }
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


    }


    solidRoof(){
        //Don't jump over the canvas.
        let setValueTo: number;
        this.isDefending ? setValueTo = Const.BUBBLES_Y_DIFF : setValueTo = 0;
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
            if(this.x < Const.BUBBLES_X_DIFF) {
                this.x = Const.BUBBLES_X_DIFF
            }
            if(this.x > Const.CANVAS_WIDTH - Const.PLAYER_WIDTH - Const.BUBBLES_X_DIFF){
                this.x = Const.CANVAS_WIDTH - Const.PLAYER_WIDTH - Const.BUBBLES_X_DIFF;
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
        if(this.cursor_X > Const.CANVAS_WIDTH - Const.TARGET_SIZE){
            this.cursor_X = Const.CANVAS_WIDTH - Const.TARGET_SIZE;
        }
        if(this.cursor_X < 0){
            this.cursor_X = 0;
        }
        if(this.cursor_Y < 0){
            this.cursor_Y = 0;
        }
        if(this.cursor_Y > Const.GROUND_HEIGHT_Y - Const.TARGET_SIZE){
            this.cursor_Y = Const.GROUND_HEIGHT_Y - Const.TARGET_SIZE;
        }
    }

    // determines which image sprite will be rendered
    checkDirection(){
        if(this.isLeftKeyPressed){
            return Const.LEFT_SPRITE;
        }
        if(this.isLeftKeyPressed == false && this.isRightKeyPressed == false){
            return Const.MIDDLE_SPRITE;
        }
        if(this.isRightKeyPressed){
            return Const.RIGHT_SPRITE;
        }
    }

    //Getter Methods
    getX(){
        return this.x;
    }

    getY(){
        return this.y
    }

    getCursorX(){
        return this.cursor_X;
    }
    getCursorY(){
        return this.cursor_Y;
    }
    
    getBubblesX(){
        return this.bubble_X;
    }

    getBubblesY(){
        return this.bubble_Y;
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

    getIsJumping(){
        return this.isJumping;
    }

    getIsTakingAction(){
        return this.isTakingAction;
    }

    getIsDefending(){
        return this.isDefending;
    }

    getAttackX(){
        return this.attack.get_X();
    }

    getAttackY(){
        return this.attack.get_Y();
    }
    
    getVelocityX(){
        return this.velocityX;
    }

    getVelocityY(){
        return this.velocityY;
    }

    //check if player is in the air
    //if velocity is 0, player is not moving along y-axis
    getIsInTheAir(){
        return this.velocityY === 0 ? false : true ;
    }

    //Setter Methods
    setIsDefending(isDefending: boolean){
        this.isDefending = isDefending;
    }
    setCursorPosition(cursor_X: number, cursor_Y: number){
        this.cursor_X = cursor_X;
        this.cursor_Y = cursor_Y;
    }

    //only one action at the same time is allowed, if players is already takingAction
    //another kind of action won't be executed
    //TODO:Sync of shoot and defend
    setIsTakingAction(isTakingAction : boolean, kindOfAction : string){
        this.isTakingAction = isTakingAction;
        this.kindOfAction = kindOfAction;
        switch (kindOfAction) {
            case "a": // a is attack
                this.attack = new ShootAction(
                    this.x, 
                    this.y, 
                    this.cursor_X, 
                    this.cursor_Y
                );
                break;
            // case "d": // d is defend
            //     this.isDefending = true;
            //     break;
            default:
                return;
        }
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
