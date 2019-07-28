import { Player } from './Player';
import { clientList } from './clientList';
import { GlobalConstants as Const } from '../global/GlobalConstants';
import { GameState } from '../global/GameState';
import { PlayerState } from "../global/PlayerState";
import { ShootActionState } from "../global/ShootActionState";
import { CollisionDetection } from './CollisionDetection';

export class GameHandler {
    private clientList: clientList;
    private gameState: GameState;


    constructor(clientList: clientList, gameState: GameState){
        this.clientList = clientList;
        this.gameState = gameState;
    }

    //check if two clients are connected in order to play the game
    twoClientsAreConnected(){
        return (this.clientList.length === 2);
    }

    //Game starts when both players are ready
    startGame(){
        let player1 = this.clientList[0].player,
            player2 =  this.clientList[1].player;
    
        if(player1.getIsReadyToStartGame() && player2.getIsReadyToStartGame()){
            this.gameState.setGameOver(false);
            console.log(`GameOver: ${this.gameState.getGameOver()} -- Game start!`);
            
            player1.resetPlayer();
            player2.resetPlayer();
        }
    }

    //reset game to initial state
    resetGame(){
        if(this.clientList.length !== 0){
          for (let i in this.clientList){
            this.clientList[i].player.resetPlayer();
          }
        }
        this.gameState.resetGameState();
    }

    //reset game without disconnecting to allow players to play again
    playAgain(){
        if(this.gameState.winnerIsCalculated()){
          this.resetGame();
        }
    }

    //starts timer and calculate remaining time
    handleTimer() {
        if (this.gameState.getGameOver() === false) {
            if (this.gameState.getTimerStarted() === false) {
            this.gameState.startTimer();
            }
            let oldTime = this.gameState.getTimeLeft();
            this.gameState.calculateTimeLeft();
            if(oldTime !== this.gameState.getTimeLeft()){
              console.log(this.gameState.getTimeLeft());
            }
        }
    } 
    
    //calculate player collisions 
    //TODO: Should grid collision also be here or better in player.updatePlayserState()????
    calculateCollisions({currentPlayerIndex} : {currentPlayerIndex: string}){
        CollisionDetection.handlePlayerCollision(currentPlayerIndex, this.clientList);
        CollisionDetection.handleShootObjectCollision(currentPlayerIndex, this.clientList);
    }

    //calculate all global factors of game
    calculateGameState(){
        if(this.twoClientsAreConnected()){
            this.startGame();
            this.handleTimer();
            this.setWinnerIdAfterTimeIsUp();
            this.setWinnerIdAfterNoHealthPointsLeft();
          } else {
            this.gameState.setWinnerId(Const.WINNER_INITIAL_STATE);
            this.gameState.setGameOver(true);
          }
    }

    //after given time is up the winner is calculated and setted
    setWinnerIdAfterTimeIsUp(){
      if (this.gameState.timeLeft === 0 && !this.gameState.getGameOver()){
        const player1 = this.clientList[0].player;
        const player2 = this.clientList[1].player;
        let winnerId: number;

        if (player1.getHealthPoints() > player2.getHealthPoints()){
          winnerId = player1.getId();
        }
        if (player1.getHealthPoints() < player2.getHealthPoints()){
          winnerId = player2.getId();
        }
        if(player1.getHealthPoints() === player2.getHealthPoints()){
          winnerId = Const.GAMEOVER_DRAW;
        }
        this.gameState.setWinnerId(winnerId);
      }
    }

    //if one of the players has no healthpoints left the winner is calculated and setted
    setWinnerIdAfterNoHealthPointsLeft(){
        const player1 = this.clientList[0].player;
        const player2 = this.clientList[1].player;
  
        if(player1.getHealthPoints() <= 0 || (player2.getHealthPoints() <= 0)){
          if (player1.getHealthPoints() > player2.getHealthPoints()){
            this.gameState.setWinnerId(player1.getId());
  
          } else {
            this.gameState.setWinnerId(player2.getId());
          }
        }
    }

    //make playerState out of player for sending it to client to use 
    makePlayerState(player: Player, shootActionState: ShootActionState){
        let playerState = new PlayerState({
          x: player.getX(),
          y: player.getY(),
          cursorX: player.getCursorX(),
          cursorY: player.getCursorY(),
          clippingPosition: player.checkLookingDirection(),
          id: player.getId(),
          isInTheAir: player.getIsInTheAir(),
          healthPoints: player.getHealthPoints(),
          wasProtected: player.getWasProtected(),
          wasHit: player.getWasHit(),
          isShooting: player.getIsShooting(),
          isDefending: player.getIsDefending(),
          shootActionState: shootActionState
        });
  
        return playerState;
    }

    //make shootActionState if player is shooting, else default shootActionState
    makeShootActionState(player: Player){
        let shootActionState: ShootActionState;
        if(player.getIsShooting()){
          shootActionState = new ShootActionState({x: player.getShootActionX(), y: player.getShootActionY()});
        } else {
          shootActionState = new ShootActionState({x: 0, y: 0});
        }
  
        return shootActionState;
    }

    //update all variables related to players and then pack it as PlayerState into PlayerStates Array
    packPlayerStates(){
        //GameStatePacker
        for(let i in this.clientList){
            let player = this.clientList[i].player;

            //update player if there is no winner -> game still running
            //which means if there is a winner --> stop player actions
            if(!this.gameState.winnerIsCalculated()){
              player.updatePlayerState();
            }
            
            //make a new shootActionState
            let shootActionState = this.makeShootActionState(player);
            //calculate all collisisons with other player or shootObject
            this.calculateCollisions({currentPlayerIndex: i});
            //make playerstate with updated player and new shootActionState
            let playerState = this.makePlayerState(player, shootActionState);
            //add it to gamestate.playerStates
            this.gameState.addPlayerState(playerState);
            //after adding the new playerState to gameState set collision results with shootObject to false
            player.setWasProtected(false);
            player.setWasHit(false);
        }
    }

}