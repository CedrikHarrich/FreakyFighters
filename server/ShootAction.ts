import { GlobalConstants as Const } from "../global/GlobalConstants"

export class ShootAction {
    private x : number;
    private y : number;
    private dx : number; //delta x
    private dy : number;
    private distance : number;
    private speed : number = 8;
    private velocityX : number;
    private velocityY : number;
    private actionComplete : boolean = false;
    private ObjectSize: number;
    player : any;


    constructor(player: any, start_X: number, start_Y: number, target_X:number, target_Y:number){
        this.player = player;
        this.x = start_X + Const.SHOOT_OBJECT_SIZE; //+ Const.SHOOT_OBJECT_SIZE;
        this.y = start_Y + Const.SHOOT_OBJECT_SIZE; //+ Const.SHOOT_OBJECT_SIZE;

        this.dx = target_X - 20 - this.x;
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
        if(this.x > Const.CANVAS_WIDTH || this.x < 0 ){
            allConditionsComplied = true;
        }

        if(this.y > Const.GROUND_HEIGHT_Y - Const.SHOOT_OBJECT_SIZE || this.y < 0){
            allConditionsComplied = true;
        }
        return allConditionsComplied;
    }

}