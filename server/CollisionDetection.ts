import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Player } from './Player';
import { clientList } from './clientList';
import { BlockObject } from './BlockObject';


export abstract class  CollisionDetection {
  static readonly blockArray: Array<BlockObject> = CollisionDetection.setBlockArray();

  private static setBlockArray(){
    let blockArray: Array<BlockObject> = [];

    for (let i = 0; i < Const.GRID_1.length; i++){
        for (let j = 0; j < Const.GRID_1[i].length; j++){
            if(Const.GRID_1[i][j] === 1){
              blockArray.push(
                new BlockObject(Const.BLOCK_WIDTH * j, Const.BLOCK_WIDTH * i)
              );
            }
          }
      }

    return blockArray;
  }

  static handleGridCollision(player: Player){
    for(let i=0; i < this.blockArray.length; i++ ){
      let block = this.blockArray[i];

      //Check if players have collsions with blocks
      if (this.isColliding(player, block)) {

          //Handle collisions accordingly
          if (player.getVelocityY() >= 0 && player.getY() + Const.PLAYER_HEIGHT-Const.SETBACK < block.getY()){
              if (player.getIsDownKeyPressed() == false && Const.FALL_THROUGH_BLOCKS){
                  player.setVelocityY(0);
                  player.setY(block.getY() - Const.PLAYER_HEIGHT);
                  player.setIsJumping(false);
              }
          }
      }
    }
  }

  static handlePlayerCollision(currentPlayerIndex: any, clientList: clientList){
    var currentPlayer = clientList[currentPlayerIndex].player;

    for(var i in clientList){
      var otherPlayer = clientList[i].player;

          if (i !== currentPlayerIndex && this.isColliding(currentPlayer, otherPlayer) ){

            if(this.isEdgeColliding(currentPlayer, otherPlayer)){
              return;
            }

            //Push player to the right
            else if(this.isPushingRight(currentPlayer, otherPlayer)){
              otherPlayer.setX(currentPlayer.getX() + Const.PLAYER_WIDTH - Const.BLOCK_WIDTH);
            }

            //Push player to the left
            else if (this.isPushingLeft(currentPlayer, otherPlayer)){
              currentPlayer.setX(otherPlayer.getX() - Const.PLAYER_WIDTH + Const.BLOCK_WIDTH);
            }
          }
      }
  }

  private static isColliding(blockOne: BlockObject, blockTwo: BlockObject) : boolean {
    return blockOne.getX() + Const.PLAYER_WIDTH > blockTwo.getX() + Const.PERMEABLE_EDGES &&
            blockOne.getX() + Const.PERMEABLE_EDGES < Const.BLOCK_WIDTH + blockTwo.getX() &&
            blockOne.getY() + Const.PLAYER_HEIGHT > blockTwo.getY() &&
            blockOne.getY() < Const.BLOCK_HEIGHT + blockTwo.getY()
  }

  static handleShootObjectCollision(currentPlayerIndex: any, clientList: clientList){
    var shootAction = clientList[currentPlayerIndex].player.getShootAction();

    if (shootAction !== undefined){
      for(var i in clientList){
        var otherPlayer = clientList[i].player;

        if (i !== currentPlayerIndex){
          if (this.isColliding(otherPlayer, shootAction)){
            let damagePoints: number;

            clientList[currentPlayerIndex].player.getShootAction().setShootActionComplete(true);

            if(otherPlayer.getIsDefending()){
              damagePoints = Const.HALF_DAMAGE;
              otherPlayer.setWasProtected(true);
            } else {
              damagePoints = Const.DAMAGE;
              otherPlayer.setWasHit(true);
            }

            otherPlayer.setHealthPoints(otherPlayer.getHealthPoints() - damagePoints);
            clientList[currentPlayerIndex].player.setShootAction(false);
            }
          }
        }
      }
    }

  private static collisionLeft(player: Player) : boolean{
    return player.getX() < Const.PLAYER_WIDTH - Const.BLOCK_WIDTH
  }

  private static collisionRight(player: Player) : boolean{
    return player.getX() + Const.PLAYER_WIDTH - Const.BLOCK_WIDTH > Const.CANVAS_WIDTH - Const.PLAYER_WIDTH
  }

  private static collisionBothPlayers(collisionFunction: ((player: Player) => boolean), currentPlayer: Player, otherPlayer: Player) : boolean{
    return collisionFunction(currentPlayer) && collisionFunction(otherPlayer);
  }

  private static isEdgeColliding(currentPlayer : Player, otherPlayer: Player) : boolean {
    return this.collisionBothPlayers(this.collisionLeft, currentPlayer, otherPlayer)
        || this.collisionBothPlayers(this.collisionRight, currentPlayer, otherPlayer)
  }

  private static arePlayersTouching(currentPlayer: Player, otherPlayer: Player){
    return  currentPlayer.getX() + Const.PLAYER_WIDTH > otherPlayer.getX()
  }

  private static isPushingRight(currentPlayer : Player, otherPlayer : Player){
    return this.arePlayersTouching(currentPlayer, otherPlayer) && currentPlayer.getVelocityX() > otherPlayer.getVelocityX() * (-1)
  }

  private static isPushingLeft(currentPlayer : Player, otherPlayer : Player){
       return this.arePlayersTouching(currentPlayer, otherPlayer) && currentPlayer.getVelocityX() < otherPlayer.getVelocityX() * (-1)
    }
}
