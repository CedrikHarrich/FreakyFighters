class Game {
    gridHeight : number = 25;
    gridWidth : number = 25;
    grid : Block[][];
    playerOne : Player;
    playerTwo : Player;
    canvasHeight : number;
    canvasWidth : number;
    background : File; 
   
    constructor(playerOne : Player, playerTwo : Player, background? : File){
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }
}