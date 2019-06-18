export class Player {
    //Attributes of the player.
    private x : number = 0;
    private y : number = 0;
    private velocityX : number = 0;
    private velocityY : number = 0;
    private id :number = 0;

    //Actions the player can make
    private isUpKeyPressed : boolean;
    private isLeftKeyPressed : boolean;
    private isDownKeyPressed : boolean;
    private isRightKeyPressed : boolean;
    private isJumping : boolean;

    //Constants
    private jumpHeight : number = 80;

    constructor(id :number){
        this.id = id;
        this.isUpKeyPressed = false;
        this.isLeftKeyPressed = false;
        this.isDownKeyPressed = false;
        this.isRightKeyPressed = false;
        this.isJumping = false;
        
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
        if (this.x < -120){
            this.x = 960; 
        }
        if (this.x > 960){
            this.x = -120;
        }
        //Only change the positions if everything is checked.
        this.velocityY +=1.2;
        this.x += this.velocityX; 
        this.y += this.velocityY; 
        this.velocityX *= 0.9; //friction 
        this.velocityY *= 0.9; //friction 

        //Don't fall through the platform.
        if (this.y > 640 - 80 - 120){
            this.isJumping = false;
            this.y = 640 - 80 - 120;
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