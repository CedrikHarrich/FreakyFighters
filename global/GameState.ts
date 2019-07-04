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

export class PlayerState0 {
  readonly positionX: number;
  readonly positionY: number;
  readonly cursorX: number;
  readonly cursorY: number;
  readonly spriteNumber: number;
  readonly id: number;
  readonly isTakingAction: boolean
  private actionState: ActionState;

  constructor({positionX, positionY, cursorX, cursorY, spriteNumber, id, isTakingAction, actionState} : {positionX:number, positionY:number, cursorX: number, cursorY: number, spriteNumber:number, id:number, isTakingAction: boolean, actionState:ActionState}){
    this.positionX = positionX;
    this.positionY = positionY;
    this.cursorX = cursorX;
    this.cursorY = cursorY;
    this.spriteNumber = spriteNumber;
    this.id = id;
    this.isTakingAction = isTakingAction;
    this.actionState = actionState
  }

  getPositionX(){
    return this.positionX;
  }

  getPositionY(){
    return this.positionY;
  }

  getCursorX(){
    return this.cursorX;
  }

  getCursorY(){
    return this.cursorY;
  }

  getSpriteNumber(){
    return this.spriteNumber;
  }

  getId(){
    return this.id;
  }

  getActionState(){
    return this.actionState;
  }

  setActionState(actionState: ActionState){
    this.actionState = actionState;
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
