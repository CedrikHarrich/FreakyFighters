import { Player } from "../server/Player";
import { GlobalConstants as Const } from "../global/GlobalConstants";

export class GameState {
  playerStates: Array<PlayerState>;
  winner : number = Const.INITIAL_STATE;
  timerStarted : boolean = false;
  startingTime : number = Const.COUNTDOWN;
  currentTime : number = Const.INITIAL_STATE;
  timeLeft : number = Const.COUNTDOWN;

  constructor(){
    this.playerStates = [];
  }

  calculateTimeLeft(){
    if (this.timeLeft <= 0 ){
      this.timeLeft = 0;
    } else {
      this.timeLeft = Const.COUNTDOWN - Math.floor((Date.now()- this.startingTime) / 1000);
    }
  }

  startTimer(){
    this.startingTime = Date.now();
    this.currentTime = this.startingTime;
    this.timeLeft = Const.COUNTDOWN;
    this.timerStarted = true;
  }

  resetPlayerStates(){
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
    return this.playerStates;
  }

  getPlayerState(i: number){
    if (this.playerStates.length > i) {
      return this.playerStates[i]
    }
  }

  getTimeLeft(){
    return this.timeLeft;
  }

  getTimerStarted(){
    return this.timerStarted; 
  }

  getWinner(){
    return this.winner;
  }

  setWinner(winner : number){
    this.winner = winner;
  }

  noHealthPointsLeft(){
    for (var i in this.playerStates){
      if (this.playerStates[i].getHealthPoints() <= 0){
        return true;
      }
      
    }
    return false;
  }
}

export class PlayerState extends Player {
  private isInTheAir: boolean;
  private clippingPosition: {x:number, y:number};
  private actionState: ActionState;

  constructor({x, y, cursorX, cursorY, clippingPosition, id, healthPoints, wasProtected, wasHit, isTakingAction, isDefending, isInTheAir, actionState} : {x:number, y:number, cursorX: number, cursorY: number, clippingPosition:{x:number, y:number}, id:number, healthPoints: number, wasProtected: boolean, wasHit: boolean, isTakingAction: boolean, isDefending:boolean, isInTheAir:boolean, actionState:ActionState}){
    super(id);
    this.setX(x);
    this.setY(y);
    this.setCursorPosition(cursorX, cursorY);
    this.setIsTakingAction(isTakingAction);
    this.setIsDefending(isDefending);
    this.setHealthPoints(healthPoints);
    this.setWasProtected(wasProtected);
    this.setWasHit(wasHit);
    this.isInTheAir = isInTheAir;
    this.actionState = actionState
    this.clippingPosition = clippingPosition;
  }

  getIsInTheAir(){
    return this.isInTheAir;
  }

  getClippingPosition(){
    return this.clippingPosition;
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
