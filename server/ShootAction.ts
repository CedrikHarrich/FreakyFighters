import { GlobalConstants as Const } from "../global/GlobalConstants"

export class ShootAction {
    private x: number;
    private y: number;
    private cursorX: number; // for method: checkIsPassingCursor()
    private cursorY: number; //for method: checkIsPassingCursor()
    private dx: number; //delta x
    private dy: number;
    private distance: number;
    private speed: number = 12; //davor 8
    private velocityX: number;
    private velocityY: number;
    private actionComplete: boolean = false;

    constructor(startX: number, startY: number, targetX:number, targetY:number){
        this.x = startX + Const.SHOOT_OBJECT_SIZE;
        this.y = startY + Const.SHOOT_OBJECT_SIZE;
        this.cursorX = targetX;
        this.cursorY = targetY;

        this.dx = targetX - this.x; //- 0.5*Const.SHOOT_OBJECT_SIZE;
        this.dy = targetY - this.y;
        this.distance = Math.sqrt( this.dx * this.dx + this.dy * this.dy);
        this.velocityX = (this.dx / this.distance) * this.speed;
        this.velocityY = (this.dy / this.distance) * this.speed;
    }

    updateShootObjectPosition(){
        this.x += this.velocityX;
        this.y += this.velocityY;

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

    getIsActionComplete(){
        return this.actionComplete;
    }

    checkIsOutBoundaries(){
        let allConditionsComplied = false;

        if(this.x > Const.CANVAS_WIDTH || this.x < -Const.SHOOT_OBJECT_SIZE ){
            allConditionsComplied = true;
        }

        if(this.y > Const.GROUND_HEIGHT_Y || this.y < 0){
            allConditionsComplied = true;
        }

        return allConditionsComplied;
    }
}
