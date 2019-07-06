import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Player } from './Player';

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

  static handlePlayerColission(main : any, clientList : any[]){
    var currentPlayer = clientList[main].player;
    for(var i in clientList){
        var otherPlayer = clientList[i].player;
        if (i !== main){
            if (this.havePlayerCollision(currentPlayer, otherPlayer)){
                if(currentPlayer.getX() + Const.PLAYER_WIDTH > otherPlayer.getX() && currentPlayer.getVelocityX() > otherPlayer.getVelocityX() * (-1)){
                    console.log("Schubse!");
                    otherPlayer.setX(currentPlayer.getX() + Const.PLAYER_WIDTH - 40);
                } else if (currentPlayer.getX() + Const.PLAYER_WIDTH > otherPlayer.getX() && currentPlayer.getVelocityX() < otherPlayer.getVelocityX() * (-1)){
                    console.log("Schubse!");
                    currentPlayer.setX(otherPlayer.getX() - Const.PLAYER_WIDTH +40);
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
            console.log("Players are colliding");
            return true;
        } else {
            return false;
        }

  }
}
