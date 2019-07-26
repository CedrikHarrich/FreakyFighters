import { Player } from "../server/Player";
import { ShootActionState } from "../global/ShootActionState";


export class PlayerState extends Player {
    private clippingPosition: {x:number, y:number};
    private shootActionState: ShootActionState;
    private isInTheAir: boolean;
  
    constructor({x, y, cursorX, cursorY, clippingPosition, id, isInTheAir, healthPoints, wasProtected, wasHit, isShooting, isDefending, shootActionState} : {x:number, y:number, cursorX: number, cursorY: number, clippingPosition:{x:number, y:number}, id:number, isInTheAir: boolean, healthPoints: number, wasProtected: boolean, wasHit: boolean, isShooting: boolean, isDefending:boolean, shootActionState:ShootActionState}){
      super(id);
      this.setX(x);
      this.setY(y);
      this.setCursorPosition(cursorX, cursorY);
      this.setShootAction(isShooting);
      this.setIsDefending(isDefending);
      this.setHealthPoints(healthPoints);
      this.setWasProtected(wasProtected);
      this.setWasHit(wasHit);
      this.isInTheAir = isInTheAir;
      this.shootActionState = shootActionState;
      this.clippingPosition = clippingPosition;
    }
  
    getIsInTheAir(){
      return this.isInTheAir;
    }
  
    getClippingPosition(){
      return this.clippingPosition;
    }
  
    getShootActionState(){
      return this.shootActionState;
    }
  
    getShootActionStateX(){
      return this.shootActionState.getX();
    }
  
    getShootActionStateY(){
      return this.shootActionState.getY();
    }
  }