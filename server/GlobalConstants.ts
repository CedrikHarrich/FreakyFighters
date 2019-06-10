export class GlobalConstants {
//Pixels of a Block.
static blockHeight : number = 32;
static blockWidth : number  = 32;

//Number of Blocks on the grid.
static gridHeight : number = 25;
static gridWidth : number = 25;

//Pixels of the Canvas.
static canvasHeight : number = GlobalConstants.blockHeight * GlobalConstants.gridHeight;
static canvasWidth : number= GlobalConstants.blockWidth * GlobalConstants.blockWidth;

//Which port should be used.
static port : number = 3000;

// TODO:
    // 1: Events should be here too.
}


