import { GlobalConstants as Const } from "../global/GlobalConstants"

export class Player {
    //Attributes of the player.
    private x : number = 0;
    private y : number = 0;
    private velocityX : number = 0;
    private velocityY : number = 0;
    private id :number = 0;

    //Actions the player can make
    private isUpKeyPressed : boolean = false;
    private isLeftKeyPressed : boolean = false;
    private isDownKeyPressed : boolean = false;
    private isRightKeyPressed : boolean = false;
    private isJumping : boolean = false;

    constructor(id :number){
        this.id = id;
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
        if (this.y < 0) {
            this.y = 0;
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
        if (this.x < 0){
            this.x = 0;
        }
        if (this.x > Const.CANVAS_WIDTH - Const.PLAYER_WIDTH){
            this.x = Const.CANVAS_WIDTH - Const.PLAYER_WIDTH;
        }
    }

    checkDirection(){
        if(this.isLeftKeyPressed){
            return 0;
        }
        if(this.isLeftKeyPressed == false && this.isRightKeyPressed == false){
            return 1;
        }
        if(this.isRightKeyPressed){
            return 2;
        }
    }

    //Getter Methods
    getX(){
        return this.x;
    }

    getY(){
        return this.y
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

    //Setter Methods
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


}
