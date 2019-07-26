import { GlobalConstants as Const } from "../global/GlobalConstants"
import { DynamicObject }  from "./DynamicObject";

export class ShootAction extends DynamicObject{
    private distance: number;
    private shootActionComplete: boolean = false;

    constructor(startX: number, startY: number, targetX:number, targetY:number){
        super(startX + Const.SHOOT_OBJECT_SIZE, startY + Const.SHOOT_OBJECT_SIZE);
        let dx = targetX - this.x; //- 0.5*Const.SHOOT_OBJECT_SIZE;
        let dy = targetY - this.y;
        this.distance = Math.sqrt( dx * dx + dy * dy);
        this.velocityX = (dx / this.distance) * Const.SHOOT_OBJECT_SPEED;
        this.velocityY = (dy / this.distance) * Const.SHOOT_OBJECT_SPEED;
    }

    updateShootActionStatePosition(){
        this.x += this.velocityX;
        this.y += this.velocityY;

        /*if shootActionState is outside of Canvas, the shootAction is complete
          a new kind of action can be started in Player
        */
        if(this.checkIsOutBoundaries()){
            this.shootActionComplete = true;
        }
    }

    //player use this method to determine if a new action can be started
    getIsShootActionComplete(){
        return this.shootActionComplete;
    }

    setShootActionComplete(isShootActionComplete : boolean){
        this.shootActionComplete = isShootActionComplete;
    }

    //checks if shootActionState is outside of canvas
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
