import { Player } from "../server/Player";
import { GlobalConstants as Const } from "../global/GlobalConstants";

export class GameState {
  playerStates: Array<PlayerState>;
  winner: number = Const.WINNER_INITIAL_STATE;
  timerStarted: boolean = false;
  startingTime: number = Const.COUNTDOWN;
  currentTime: number = Const.TIME_INITIAL_STATE;
  timeLeft: number = Const.COUNTDOWN;

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
  private clippingPosition: {x:number, y:number};
  private shootActionState: ShootActionState;

  constructor({x, y, cursorX, cursorY, clippingPosition, id, healthPoints, wasProtected, wasHit, isShooting, isDefending, shootActionState} : {x:number, y:number, cursorX: number, cursorY: number, clippingPosition:{x:number, y:number}, id:number, healthPoints: number, wasProtected: boolean, wasHit: boolean, isShooting: boolean, isDefending:boolean, shootActionState:ShootActionState}){
    super(id);
    this.setX(x);
    this.setY(y);
    this.setCursorPosition(cursorX, cursorY);
    this.setShootAction(isShooting);
    this.setIsDefending(isDefending);
    this.setHealthPoints(healthPoints);
    this.setWasProtected(wasProtected);
    this.setWasHit(wasHit);
    this.shootActionState = shootActionState
    this.clippingPosition = clippingPosition;
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

export class ShootActionState{
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
