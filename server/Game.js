"use strict";
exports.__esModule = true;
var Game = /** @class */ (function () {
    function Game(grid, playerOne, playerTwo, background, initialPositionOne, initialPositionTwo) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.grid = grid;
        this.background = background;
        this.initalPositionOne = initialPositionOne;
        this.initalPositionTwo = initialPositionTwo;
    }
    return Game;
}());
exports.Game = Game;
