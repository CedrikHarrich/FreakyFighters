import { Player } from './Player';
import { clientList } from './clientList';
import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Keys } from '../global/Keys';
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
            player1.resetPlayer();
            player2.resetPlayer();
        }
    }

    //reset game to initial state
    resetGame(){
        if(this.clientList.length !== 0){
          for (var i in this.clientList){
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

    //used by keyPressedHandler for pressing shoot key
    setPlayerAttack(player: Player, state: boolean){
        if(!player.getIsDefending() && !player.getIsShooting()){
          player.setShootAction(state);
        }
    }

    ////used by keyPressedHandler for pressing defense key
    setPlayerDefense(player: Player, state: boolean){
        if(!player.getIsShooting() && state === true){
          player.setIsDefending(true)
        }
  
        if(player.getIsDefending() && !state){
          player.setIsDefending(false);
        }
    }

    //used by keyPressedHandler to set player to be ready for game to start
    setPlayerGameStartReady(player: Player, socketId: number, isReady: boolean){
        player.setIsReadyToStartGame(isReady);
        this.gameState.playersInGame[socketId] = isReady;
        console.log(`Players in game: ${this.gameState.playersInGame} SocketID: ${socketId}`)
        console.log(`GameOver: ${this.gameState.getGameOver()}`);
    }

    //starts timer and calculate remaining time
    handleTimer() {
        if (this.gameState.getGameOver() === false) {
            if (this.gameState.getTimerStarted() === false) {
            this.gameState.startTimer();
            }
            console.log(this.gameState.getTimeLeft());
            this.gameState.calculateTimeLeft();
        }
    } 
    
    //calculate player collisions 
    //TODO: Should grid collision also be here or better in player.updatePlayserState()????
    calculateCollisions({currentPlayerIndex} : {currentPlayerIndex: string}){
        CollisionDetection.handlePlayerCollision(currentPlayerIndex, this.clientList);
        CollisionDetection.handleShootObjectCollision(currentPlayerIndex, this.clientList);
    }

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

    //make playerState out of player for sending to client to use 
    makePlayerState(player: Player, shootActionState: ShootActionState){
        var playerState = new PlayerState({
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

    makeShootActionState(player: Player){
        var shootActionState: ShootActionState;
        if(player.getIsShooting()){
          shootActionState = new ShootActionState({x: player.getShootActionX(), y: player.getShootActionY()});
        } else {
          shootActionState = new ShootActionState({x: 0, y: 0});
        }
  
        return shootActionState;
    }

    //used by keyPressedHandler when key.Start is pressed
    handleStartKey(player: Player, socketId: number){
        if(this.gameState.getGameOver()){
            this.setPlayerGameStartReady(player, socketId, true);
        } else {
            this.playAgain()
        }
    }

    //handle keys and mouse button pressed events
    handlePlayerActionKeys(inputId: string, player: Player, state: boolean){

        if(!this.gameState.getGameOver() && !this.gameState.winnerIsCalculated()){
            switch (inputId){
                case Keys.Up:
                    player.setIsUpKeyPressed(state);
                    break;
                case Keys.Left:
                    player.setIsLeftKeyPressed(state);
                    break;
                case Keys.Down:
                    player.setIsDownKeyPressed(state);
                    break;
                case Keys.Right:
                    player.setIsRightKeyPressed(state);
                    break;
                case (Keys.Attack):
                    this.setPlayerAttack(player, state);
                    break;
                case (Keys.Defense):
                    this.setPlayerDefense(player, state);
                    break;
                default:
                    return;
            }
        }
    }

    handlePlayerActionMouse(button: number, player: Player, state: boolean){
        if(button === Keys.AttackMouse){
            this.setPlayerAttack(player, state);
        }

        if(button === Keys.DefenseMouse){
            this.setPlayerDefense(player, state);
        }
    }

    packPlayerStates(){
        //GameStatePacker
        for(var i in this.clientList){
            var player = this.clientList[i].player;

            //update player if there is no winner -> game still running
            //which means if there is a winner stop player actions
            if(!this.gameState.winnerIsCalculated()){
              player.updatePlayerState();
            }
            
            //make a new shootActionState
            let shootActionState = this.makeShootActionState(player);
            //calculate all collisisons with other player or shootObject
            this.calculateCollisions({currentPlayerIndex: i});
            //make playerstate with updated player and new shootActionState
            let playerState = this.makePlayerState(player, shootActionState);
            //add it to gamestate
            this.gameState.addPlayerState(playerState);
            //after adding the new playerState to gameState set collision with shootObject false
            player.setWasProtected(false);
            player.setWasHit(false);
          }
    }

}