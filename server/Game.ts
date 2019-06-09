class Game {
    grid : Block[][];
    playerOne : Player;
    playerTwo : Player;
    background : File; 
   
    constructor(playerOne : Player, playerTwo : Player, background : File, grid : Block[][]){
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.grid = grid;
        this.background = background;
    }
}