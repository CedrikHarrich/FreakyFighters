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

    //Constants
    private jumpHeight : number = 80;

    private groundHeight: number;

    constructor(id :number){
        this.id = id;
        this.groundHeight = Const.GROUND_HEIGHT_FROM_TOP;
    }

    updatePosition(){
        //Change the speed depending on the Input
        if (this.isRightKeyPressed){
            this.velocityX += 1.5;
        }

        if (this.isLeftKeyPressed){
            this.velocityX -= 1.5;
        }

        if (this.isDownKeyPressed){
            this.velocityY += 3;
        }

        //Check if you can jump
        if (this.isUpKeyPressed && this.isJumping == false){
            this.velocityY -= this.jumpHeight;
            this.isJumping = true;
        }

        //Player can run to the right and pops out on the left an vice versa.
        if (this.x < (-1 * Const.PLAYER_WIDTH)){
            this.x = Const.CANVAS_WIDTH;
        }
        if (this.x > Const.CANVAS_WIDTH){
            this.x = -1 * Const.PLAYER_WIDTH;
        }
        
        //Only change the positions if everything is checked.
        this.velocityY +=1.2;
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityX *= Const.FRICTION;
        this.velocityY *= Const.FRICTION;

        //Don't fall through the platform.
        if (this.y > this.groundHeight){
            this.isJumping = false;
            this.y = this.groundHeight;
            this.velocityY = 0;
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

    getDownUpKeyPressed(){
        return this.isDownKeyPressed;
    }

    getRightUpKeyPressed(){
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
