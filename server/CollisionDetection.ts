import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Player } from './Player';
import { clientList } from './clientList';
import { BlockObject } from './BlockObject';


export abstract class  CollisionDetection {
  static readonly blockArray: Array<BlockObject> = CollisionDetection.setBlockArray();

  private static setBlockArray(){
    let blockArray: Array<BlockObject> = [];

    for (let i = Const.MAX_BLOCK_POSITION_Y; i < Const.MIN_BLOCK_POSITION_Y; i++){
        for (let j = 0; j < Const.GRID[i].length; j++){
            if(Const.GRID[i][j] === 1){
              blockArray.push(
                new BlockObject(Const.BLOCK_WIDTH * j, Const.BLOCK_WIDTH * i)
              );
            }
          }
      }

    return blockArray;
  }

  static handleBlockCollision(player: Player){
    if(Const.WITH_GRID){
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
  }

  static handlePlayerCollision(currentPlayerIndex: any, clientList: clientList){
    let currentPlayer = clientList[currentPlayerIndex].player;

    for(let i in clientList){
      let otherPlayer = clientList[i].player;

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

  static handleShootObjectCollision(currentPlayerIndex: any, clientList: clientList){
    let currentPlayer = clientList[currentPlayerIndex].player
    let shootAction = currentPlayer.getShootAction();

    if (shootAction !== undefined){
      for(let i in clientList){
        let otherPlayer = clientList[i].player;

        if (i !== currentPlayerIndex){
          if (this.isColliding(otherPlayer, shootAction)){
            let damagePoints: number;
            
            //setting type of damage depending on player's defense
            if(otherPlayer.getIsDefending()){
              damagePoints = Const.DEFENSE_DAMAGE;
              otherPlayer.setWasProtected(true);
            } else {
              damagePoints = Const.DAMAGE;
              otherPlayer.setWasHit(true);
            }

            //calculate and set new healthPoints
            otherPlayer.setHealthPoints(otherPlayer.getHealthPoints() - damagePoints);

            //delete shootObject after collision
            clientList[currentPlayerIndex].player.getShootAction().setShootActionComplete(true);
            clientList[currentPlayerIndex].player.setShootAction(false);
            console.log(`Player ${otherPlayer.getId()} was hit by Player ${currentPlayer.getId()}`)
            console.log(`--> Damage: ${(damagePoints / Const.DAMAGE) *100} %`);
            }
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
