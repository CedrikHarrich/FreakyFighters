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
  private spriteNumber: number;
  private actionState: ActionState;

  constructor({x, y, cursorX, cursorY, spriteNumber, id, isTakingAction, actionState} : {x:number, y:number, cursorX: number, cursorY: number, spriteNumber:number, id:number, isTakingAction: boolean, actionState:ActionState}){
    super(id);
    this.setX(x);
    this.setY(y);
    this.setCursorPosition(cursorX, cursorY);
    this.setIsTakingAction(isTakingAction);
    this.actionState = actionState
    this.spriteNumber = spriteNumber;
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
