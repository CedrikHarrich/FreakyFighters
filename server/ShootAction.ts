import { GlobalConstants as Const } from "../global/GlobalConstants"

export class ShootAction {
    private x : number;
    private y : number;
    private cursorX: number; // for method: checkIsPassingCursor()
    private cursorY: number; //for method: checkIsPassingCursor()
    private dx : number; //delta x
    private dy : number;
    private distance : number;
    private speed : number = 22; //davor 8
    private velocityX : number;
    private velocityY : number;
    private actionComplete : boolean = false;



    constructor(start_X: number, start_Y: number, target_X:number, target_Y:number){
        this.x = start_X + Const.SHOOT_OBJECT_SIZE; 
        this.y = start_Y + Const.SHOOT_OBJECT_SIZE; 
        this.cursorX = target_X;
        this.cursorY = target_Y;

        this.dx = target_X - this.x; //- 0.5*Const.SHOOT_OBJECT_SIZE;
        this.dy = target_Y - this.y;
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
        /*
        //action is complete if shoot object meet cursor
        if(this.checkIsPassingCursor()){
            this.actionComplete = true;
        }
        */
    }
    
    get_X(){
        return this.x;
    }

    get_Y(){
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

    /* 
    //Methode um Schießobjekt verschwinden zu lassen, wenn es den Cursor erreicht
    checkIsPassingCursor(){
         if(this.x === this.cursorX && this.y === this.cursorY){
             return true;
         }
     }
    */

}