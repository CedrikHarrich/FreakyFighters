import { GlobalConstants as Const } from "../global/GlobalConstants"

export class ShootAction {
    private x: number;
    private y: number;
    private distance: number;
    private velocityX: number;
    private velocityY: number;
    private actionComplete: boolean = false;

    constructor(startX: number, startY: number, targetX:number, targetY:number){
        this.x = startX + Const.SHOOT_OBJECT_SIZE;
        this.y = startY + Const.SHOOT_OBJECT_SIZE;

        let dx = targetX - this.x; //- 0.5*Const.SHOOT_OBJECT_SIZE;
        let dy = targetY - this.y;
        this.distance = Math.sqrt( dx * dx + dy * dy);
        this.velocityX = (dx / this.distance) * Const.SHOOT_OBJECT_SPEED;
        this.velocityY = (dy / this.distance) * Const.SHOOT_OBJECT_SPEED;
    }

    updateShootObjectPosition(){
        this.x += this.velocityX;
        this.y += this.velocityY;

        /*if shootObject is outside of Canvas, the shootAction is complete
          a new kind of action can be started in Player
        */ 
        if(this.checkIsOutBoundaries()){
            this.actionComplete = true;
        }
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    //player use this method to determine if a new action can be started
    getIsActionComplete(){
        return this.actionComplete;
    }

    //checks if shootObject is outside of canvas
    checkIsOutBoundaries(){
        let allConditionsComplied = false;

        if(this.x > Const.CANVAS_WIDTH || this.x < -Const.SHOOT_OBJECT_SIZE ){
            allConditionsComplied = true;
        }

        if(this.y > Const.GROUND_HEIGHT_Y || this.y < -Const.SHOOT_OBJECT_SIZE){
            allConditionsComplied = true;
        }

        return allConditionsComplied;
    }
}
