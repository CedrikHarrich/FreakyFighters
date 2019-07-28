import { PlayerState } from "../global/PlayerState";
import { GlobalConstants as Const } from "../global/GlobalConstants";

export class GameState {
  playerStates: Array<PlayerState>;
  winnerId: number = Const.WINNER_INITIAL_STATE;
  timerStarted: boolean = false;
  startingTime: number = Const.COUNTDOWN;
  currentTime: number = Const.TIME_INITIAL_STATE;
  timeLeft: number = Const.COUNTDOWN;
  gameOver: boolean = true;
  playersReadyToStartGame: Array<boolean> = [false, false];

  constructor(){
    this.playerStates = [];
  }

  calculateTimeLeft(){
    if (this.timeLeft <= 0 ){
      this.timeLeft = 0;
    } else {
      this.timeLeft = Const.COUNTDOWN - Math.floor((Date.now() - this.startingTime) / 1000);
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
    for(let i in playerStates){
      this.playerStates.push(playerStates[i]);
    }
  }

  winnerIsCalculated(){
    return this.getWinnerId() !== Const.WINNER_INITIAL_STATE;
  }

  resetPlayersReadyToStartGame(){
    this.playersReadyToStartGame = [false, false];
  }

  resetGameState(){
    this.timeLeft = Const.COUNTDOWN;
    this.timerStarted = false;
    this.setGameOver(true);
    this.resetPlayersReadyToStartGame();
    this.setWinnerId(Const.WINNER_INITIAL_STATE);
  }

  getPlayerStates(){
    return this.playerStates;
  }

  getPlayerState(i: number){
    if (this.playerStates.length > i) {
      return this.playerStates[i]
    }
  }

  getPlayersReadyToStartGame(){
    return this.playersReadyToStartGame;
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

  setGameOver(gameOver: boolean){
    this.gameOver = gameOver;
  }

  setWinnerId(winnerId : number){
    this.winnerId = winnerId;
  }
}

