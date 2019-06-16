export class GlobalConstants {
  //Network Constants
  static readonly PORT : number = 3000;
  static readonly MAX_CLIENTS : number = 2;
  static readonly SERVER_URL : string = `http://localhost:${GlobalConstants.PORT}`;

  //Grid Constants
  static readonly GRID_HEIGHT : number = 20; //Blocks
  static readonly GRID_WIDTH : number = 30; //Blocks
  static readonly BLOCK_HEIGHT : number = 32; //Pixels per Block
  static readonly BLOCK_WIDTH : number = 32; // Pixels per Block

  //Canvas Constants
  static readonly CANVAS_HEIGHT : number = GlobalConstants.GRID_HEIGHT * GlobalConstants.BLOCK_HEIGHT; //640 Pixels
  static readonly CANVAS_WIDTH : number = GlobalConstants.GRID_WIDTH * GlobalConstants.BLOCK_WIDTH; //960 Pixels

  //Character Constants
  static readonly PLAYER_HEIGHT : number = 120;
  static readonly PLAYER_WIDTH : number  = 120;

  static readonly PLAYER_1_START_X_COORDS : number = 140;
  static readonly PLAYER_2_START_X_COORDS : number = 820;
  
  //Level Constants
  static readonly GROUND_HEIGHT = 80;

}
