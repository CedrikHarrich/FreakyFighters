export class Game {
    grid : Block[][];
    playerOne : Player;
    playerTwo : Player;
    background : File;
    initalPositionOne: [number, number];
    initalPositionTwo: [number, number];
   
    constructor(grid : Block[][], playerOne : Player, playerTwo : Player, background : File, initialPositionOne: [number, number], initialPositionTwo: [number, number]){
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.grid = grid;
        this.background = background;
        this.initalPositionOne = initialPositionOne;
        this.initalPositionTwo = initialPositionTwo;
    }
}