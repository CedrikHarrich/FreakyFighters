import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Player } from './Player';
import { ShootAction } from './ShootAction';

export class CollisionDetection {
  static handleCollision(player: Player, grid: any){
      //Check the grid for blocks
      for (let i = 0; i < grid.length; i++){
          for (let j = 0; j < grid[i].length; j++){
              if(grid[i][j] === 1){
                  //Calculate the coordinates of each block (upper left corner)
                  var blockPositionX = Const.BLOCK_WIDTH * j;
                  var blockPositionY = Const.BLOCK_HEIGHT * i;

                  //Check if players have collsions with blocks
                  if (this.haveCollision(player, blockPositionX, blockPositionY)) {

                      //Handle collisions accordingly
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

          if(this.hasEdgeCollision(currentPlayer, otherPlayer)){
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

  private static haveShootObjectCollision(player : Player, shootAction : ShootAction){
    //Collision without block
    if(player.getX() + Const.PLAYER_WIDTH > shootAction.getX() + Const.PERMEABLE_EDGES &&
    player.getX() + Const.PERMEABLE_EDGES < Const.BLOCK_WIDTH + shootAction.getX() &&
    player.getY() + Const.PLAYER_HEIGHT > shootAction.getY() &&
    player.getY() < Const.BLOCK_HEIGHT + shootAction.getY()) {
        return true;
    } else {
        return false;
    }
  }

  static handleShootObjectCollision(main: any, clientList: any[]){
    var shootAction = clientList[main].player.getShootAction();

    if (shootAction !== undefined){
      for(var i in clientList){
        var otherPlayer = clientList[i].player;

        if (i !== main){
          if (this.haveShootObjectCollision(otherPlayer, shootAction)){
            let damagePoints: number;

            clientList[main].player.getShootAction().setShootActionComplete(true);

            if(otherPlayer.getIsDefending()){
              damagePoints = Const.HALF_DAMAGE;
              otherPlayer.setWasProtected(true);
            } else {
              damagePoints = Const.DAMAGE;
              otherPlayer.setWasHit(true);
            }

            otherPlayer.setHealthPoints(otherPlayer.getHealthPoints() - damagePoints);
            clientList[main].player.setShootAction(false);
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
