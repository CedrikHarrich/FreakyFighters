import { GlobalConstants as Const } from "../global/GlobalConstants"

export class ShootAction {
    private x : number;
    private y : number;
    private dx : number; //delta x
    private dy : number; //delta y
    private distance : number;
    private velocityX : number;
    private velocityY : number;
    private actionComplete : boolean = false;



    constructor(start_X: number, start_Y: number, target_X:number, target_Y:number){
        //to start in the middle top of player
        this.x = start_X + Const.SHOOT_OBJECT_SIZE; 
        this.y = start_Y + Const.SHOOT_OBJECT_SIZE; 

        this.dx = target_X - this.x;
        this.dy = target_Y - this.y;
        this.distance = Math.sqrt( this.dx * this.dx + this.dy * this.dy);
        this.velocityX = (this.dx / this.distance) * Const.SHOOT_OBJECT_SPEED;
        this.velocityY = (this.dy / this.distance) * Const.SHOOT_OBJECT_SPEED;

        
    }

    updateShootObjectPosition(){
        this.x += this.velocityX;
        this.y += this.velocityY;

        /*if shootObject is outside of Canvas, the shootAction is complete
        a new kind of action can be started in Player*/ 
        if(this.checkIsOutBoundaries()){
            this.actionComplete = true;
        }
    }
    
    get_X(){
        return this.x;
    }

    get_Y(){
        return this.y;
    }

    //player use this method to determine if a new action can be started
    getIsActionComplete(){
        return this.actionComplete;
    }

    //checks if shootObject is outside of canvas
    checkIsOutBoundaries(){
        let allConditionsComplied = false;
        //checks left and right boundaries
        if(this.x > Const.CANVAS_WIDTH || this.x < -Const.SHOOT_OBJECT_SIZE){
            allConditionsComplied = true;
        }

        //checks top and bottom boundaries
        if(this.y > Const.GROUND_HEIGHT_Y || this.y < -Const.SHOOT_OBJECT_SIZE){
            allConditionsComplied = true;
        }
        return allConditionsComplied;
    }

}