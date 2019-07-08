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

  static handlePlayerCollision(main : any, clientList : any[]){
    var currentPlayer = clientList[main].player;
    for(var i in clientList){
        var otherPlayer = clientList[i].player;
        if (i !== main){
            if (this.havePlayerCollision(currentPlayer, otherPlayer) ){
                //Don't push on the left
                if(currentPlayer.getX() < Const.PLAYER_WIDTH -40 && otherPlayer.getX() < Const.PLAYER_WIDTH -40){

                }
                else if(currentPlayer.getX() + Const.PLAYER_WIDTH -40 > Const.CANVAS_WIDTH - Const.PLAYER_WIDTH && otherPlayer.getX()+ Const.PLAYER_WIDTH -40 > Const.CANVAS_WIDTH- Const.PLAYER_WIDTH){}
                

                //Push player to the right
                else if(currentPlayer.getX() + Const.PLAYER_WIDTH > otherPlayer.getX() && currentPlayer.getVelocityX() > otherPlayer.getVelocityX() * (-1)){
                    otherPlayer.setX(currentPlayer.getX() + Const.PLAYER_WIDTH - 40);
                }
                //Push player to the left
                else if (currentPlayer.getX() + Const.PLAYER_WIDTH > otherPlayer.getX() && currentPlayer.getVelocityX() < otherPlayer.getVelocityX() * (-1)){
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

  static handleShootObjectCollision(main : any, clientList : any[]){
    var shootObject = clientList[main].player.getAction();
    if (shootObject !== undefined){

    
    for(var i in clientList){
        var otherPlayer = clientList[i].player;
        if (i !== main){
            if (this.haveShootObjectCollision(otherPlayer, shootObject)){
                //Schuss be gone
                console.log("Project hits");
                clientList[main].player.getAction().setShootActionComplete(true);
                

                //Shield?
                    //Yasss: Healtpoints be gone 
                    

                    //nope
                    otherPlayer.setHealthpoints(otherPlayer.getHealthPoints() - 10);
                    console.log(otherPlayer.getHealthPoints());
                    clientList[main].player.setIsTakingActionVariable(false);
                    clientList[main].player.setAction(undefined);
            }
        }
    }
}
}
}
