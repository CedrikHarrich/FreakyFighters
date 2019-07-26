import { Player } from './Player';
import { Keys } from '../global/Enums';
import { GameState } from '../global/GameState';
import { GameHandler } from './GameHandler';

export class GameEventHandler {
    private gameState: GameState;
    private gameHandler: GameHandler;


    constructor(gameHandler: GameHandler, gameState: GameState){
        this.gameHandler = gameHandler;
        this.gameState = gameState;
    }

    //used by handleStartKey to set player to be ready for game to start
    setPlayerGameStartReady(player: Player, socketId: number, isReady: boolean){
        player.setIsReadyToStartGame(isReady);
        this.gameState.playersReadyToStartGame[socketId] = isReady;
        console.log(`Players in game: ${this.gameState.playersReadyToStartGame}`)
        console.log(`GameOver: ${this.gameState.getGameOver()} -- Still waiting, not ready!`);
    }

    //used by keyPressedHandler when key.Start is pressed
    handleStartKey(player: Player, socketId: number){
        if(this.gameState.getGameOver()){
            this.setPlayerGameStartReady(player, socketId, true);
        } else {
            this.gameHandler.playAgain()
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

    //handle mouse buttons pressed
    handlePlayerActionMouse(button: number, player: Player, state: boolean){
        if(!this.gameState.getGameOver() && !this.gameState.winnerIsCalculated()){
            if(button === Keys.AttackMouse){
                this.setPlayerAttack(player, state);
            }
    
            if(button === Keys.DefenseMouse){
                this.setPlayerDefense(player, state);
            }
        }
    }

    //handle keys pressed events
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

    handleCursorTarget(player: Player, data: any){
        player.setCursorPosition(data.cursorX, data.cursorY);
    }
}