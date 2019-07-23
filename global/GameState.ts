import { Player } from "../server/Player";
import { GlobalConstants as Const } from "../global/GlobalConstants";

export class GameState {
  playerStates: Array<PlayerState>;
  winnerId: number = Const.WINNER_INITIAL_STATE;
  timerStarted: boolean = false;
  startingTime: number = Const.COUNTDOWN;
  currentTime: number = Const.TIME_INITIAL_STATE;
  timeLeft: number = Const.COUNTDOWN;
  gameOver: boolean = true;
  // TODO maybe nicer solution
  playersInGame: Array<boolean> = [undefined, false, false];


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

  getPlayersInGame(){
    return this.playersInGame;
  }

  getGameOver(){
    return this.gameOver;
  }

  getTimeLeft(){
    return this.timeLeft;
  }

  getTimerStarted(){
    return this.timerStarted;
  }

  getWinnerId(){
    return this.winnerId;
  }

  resetPlayersInTheGame(){
    this.playersInGame = [undefined, false, false];
  }

  setGameOver(gameOver: boolean){
    this.gameOver = gameOver;
  }

  setWinnerId(winnerId : number){
    this.winnerId = winnerId;
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
