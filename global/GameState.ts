import { Player } from "../server/Player";

export class GameState {
  readonly playerStates: Array<PlayerState>;

  constructor(){
    this.playerStates = [];
  }

  addPlayerState(playerState: PlayerState){
    this.playerStates.push(playerState);
  }

  addPlayerStates(playerStates: Array<PlayerState>){
    for(var i in playerStates){
      this.playerStates.push(playerStates[i]);
    }
  }

  getPlayerStates(){
    return this.playerStates
  }

  getPlayerState(i: number){
    if (this.playerStates.length > i) {
      return this.playerStates[i]
    }
  }
}

export class PlayerState extends Player {
  private isInTheAir: boolean;
  private spriteNumber: number;
  private actionState: ActionState;

  constructor({x, y, cursorX, cursorY, spriteNumber, id, isTakingAction, isDefending, isInTheAir, actionState} : {x:number, y:number, cursorX: number, cursorY: number, spriteNumber:number, id:number, isTakingAction: boolean, isDefending:boolean, isInTheAir:boolean, actionState:ActionState}){
    super(id);
    this.setX(x);
    this.setY(y);
    this.setCursorPosition(cursorX, cursorY);
    this.setIsTakingAction(isTakingAction);
    this.setIsDefending(isDefending);
    this.isInTheAir = isInTheAir;
    this.actionState = actionState
    this.spriteNumber = spriteNumber;
  }

  getIsInTheAir(){
    return this.isInTheAir;
  }

  getSpriteNumber(){
    return this.spriteNumber;
  }

  getActionState(){
    return this.actionState;
  }

  getActionX(){
    return this.actionState.getX();
  }

  getActionY(){
    return this.actionState.getY();
  }
}

export class ActionState{
  private x : number;
  private y : number;

  // constructor()

  constructor({x, y} : {x : number, y : number}){
    this.x = x;
    this.y = y;
  }

  getX(){
    return this.x;
  }

  getY(){
    return this.y;
  }
}
