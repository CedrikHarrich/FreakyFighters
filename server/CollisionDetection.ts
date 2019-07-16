import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Player } from './Player';
import { ShootAction } from './ShootAction';

export class CollisionDetection {
  static handleCollision(player: Player, grid: any){
      //Check the grid for blocks.
      for (let i = 0; i < grid.length; i++){
          for (let j = 0; j < grid[i].length; j++){
              if(grid[i][j] === 1){
                  //Calculate the Coordinates of each Block (Left Upper Corner)
                  var blockPositionX = Const.BLOCK_WIDTH * j;
                  var blockPositionY = Const.BLOCK_HEIGHT * i;

                  //Check if Players have collsions with blocks.
                  if (this.haveCollision(player, blockPositionX, blockPositionY)) {

                      //Handle Collisions accordingly
                      if (player.getVelocityY() >= 0 && player.getY() + Const.PLAYER_HEIGHT-Const.SETBACK < blockPositionY){
                          if (player.getIsDownKeyPressed() == false && Const.FALL_THROUGH_BLOCKS){
                              player.setVelocityY(0);
                              player.setY(blockPositionY - Const.PLAYER_HEIGHT);
                              player.setIsJumping(false);
                          }
                      }
                  }
              }
          }
      }
  }

  static haveCollision(player: Player, blockPositionX: number, blockPositionY: number) : boolean {
      if (player.getX() + Const.PLAYER_WIDTH > blockPositionX + Const.PERMEABLE_EDGES &&
          player.getX() + Const.PERMEABLE_EDGES < Const.BLOCK_WIDTH + blockPositionX &&
          player.getY() + Const.PLAYER_HEIGHT > blockPositionY &&
          player.getY() < Const.BLOCK_HEIGHT + blockPositionY)
      {
          return true;
      } else {
          return false;
      }
  }

  static handlePlayerCollision(main: any, clientList: any[]){
    var currentPlayer = clientList[main].player;
    for(var i in clientList){
      var otherPlayer = clientList[i].player;
        if (i !== main){
          if (this.havePlayerCollision(currentPlayer, otherPlayer) ){

          if(CollisionDetection.hasEdgeCollision(currentPlayer, otherPlayer)){
            return;
          }
          //Push player to the right
          else if(CollisionDetection.isPushingRight(currentPlayer, otherPlayer)){
            otherPlayer.setX(currentPlayer.getX() + Const.PLAYER_WIDTH - Const.BLOCK_WIDTH);
          }
          //Push player to the left
          else if (CollisionDetection.isPushingLeft(currentPlayer, otherPlayer)){
            currentPlayer.setX(otherPlayer.getX() - Const.PLAYER_WIDTH + Const.BLOCK_WIDTH);
          }
        }
      }
    }
  }

  private static havePlayerCollision(playerOne: Player, playerTwo: Player) : boolean {
    if (    playerOne.getX() + Const.PLAYER_WIDTH > playerTwo.getX() + Const.PERMEABLE_EDGES &&
            playerOne.getX() + Const.PERMEABLE_EDGES < Const.BLOCK_WIDTH + playerTwo.getX() &&
            playerOne.getY() + Const.PLAYER_HEIGHT > playerTwo.getY() &&
            playerOne.getY() < Const.BLOCK_HEIGHT + playerTwo.getY())
        {
            return true;
        } else {
            return false;
        }

  }

  private static haveShootObjectCollision(player : Player, shootObject : ShootAction){
    //Collision ohne Block
    if(player.getX() + Const.PLAYER_WIDTH > shootObject.getX() + Const.PERMEABLE_EDGES &&
    player.getX() + Const.PERMEABLE_EDGES < Const.BLOCK_WIDTH + shootObject.getX() &&
    player.getY() + Const.PLAYER_HEIGHT > shootObject.getY() &&
    player.getY() < Const.BLOCK_HEIGHT + shootObject.getY()) {
        return true;
    } else {
        return false;
    }
  }

  static handleShootObjectCollision(main: any, clientList: any[]){
    var shootObject = clientList[main].player.getAction();

    if (shootObject !== undefined){
      for(var i in clientList){
        var otherPlayer = clientList[i].player;

        if (i !== main){
          if (this.haveShootObjectCollision(otherPlayer, shootObject)){
            let damagePoints: number;

            clientList[main].player.getAction().setShootActionComplete(true);

            if(otherPlayer.getIsDefending()){
              damagePoints = Const.HALF_DAMAGE;
              otherPlayer.setWasProtected(true);
            } else {
              damagePoints = Const.DAMAGE;
              otherPlayer.setWasHit(true);
            }

            otherPlayer.setHealthPoints(otherPlayer.getHealthPoints() - damagePoints);
            clientList[main].player.setIsTakingActionVariable(false);
            clientList[main].player.setAction(undefined);
            }
          }
        }
      }
    }

    private static hasEdgeCollision(currentPlayer : Player, otherPlayer: Player) : boolean{
      if ((currentPlayer.getX() < Const.PLAYER_WIDTH - Const.BLOCK_WIDTH 
          && otherPlayer.getX() < Const.PLAYER_WIDTH - Const.BLOCK_WIDTH)
          || (currentPlayer.getX() + Const.PLAYER_WIDTH - Const.BLOCK_WIDTH > Const.CANVAS_WIDTH - Const.PLAYER_WIDTH 
          && otherPlayer.getX() + Const.PLAYER_WIDTH - Const.BLOCK_WIDTH > Const.CANVAS_WIDTH - Const.PLAYER_WIDTH)){
            return true;
      } else {
            return false;
      }
      
    }

    private static isPushingRight(currentPlayer : Player, otherPlayer : Player){
      if(currentPlayer.getX() + Const.PLAYER_WIDTH > otherPlayer.getX() && currentPlayer.getVelocityX() > otherPlayer.getVelocityX() * (-1)){
        return true;
      } else {
        return false;
      }
    }

    private static isPushingLeft(currentPlayer : Player, otherPlayer : Player){
      if(currentPlayer.getX() + Const.PLAYER_WIDTH > otherPlayer.getX() && currentPlayer.getVelocityX() < otherPlayer.getVelocityX() * (-1)){
        return true;
      } else {
        return false;
      }
    }
}
