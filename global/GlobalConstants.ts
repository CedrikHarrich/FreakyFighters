export class GlobalConstants{
  //Network Constants
  static readonly PORT : number = 3000;
  static readonly MAX_CLIENTS : number = 2;
  static readonly SERVER_URL : string = `http://localhost:${GlobalConstants.PORT}`;
  static readonly ASSET_FOLDER : string = "assets/"

  //Grid Constants
  static readonly GRID_HEIGHT : number = 16; //Blocks
  static readonly GRID_WIDTH : number = 27; //Blocks
  static readonly BLOCK_HEIGHT : number = 40; //Pixels per Block
  static readonly BLOCK_WIDTH : number = 40; // Pixels per Block

  //Canvas Constants
  static readonly CANVAS_HEIGHT : number = GlobalConstants.GRID_HEIGHT * GlobalConstants.BLOCK_HEIGHT; //640 Pixels
  static readonly CANVAS_WIDTH : number = GlobalConstants.GRID_WIDTH * GlobalConstants.BLOCK_WIDTH; //1080 Pixels

  //Character Constants
  static readonly PLAYER_HEIGHT : number = 120;
  static readonly PLAYER_WIDTH : number  = 120;
  static readonly JUMP_HEIGHT = 65;

  static readonly PLAYER_1_START_X_COORDS : number = GlobalConstants.PLAYER_WIDTH + GlobalConstants.BLOCK_WIDTH + GlobalConstants.BLOCK_WIDTH;
  static readonly PLAYER_2_START_X_COORDS : number = GlobalConstants.CANVAS_WIDTH - GlobalConstants.PLAYER_WIDTH - GlobalConstants.BLOCK_WIDTH;

  //Level Constants
  static readonly GROUND_HEIGHT_FROM_BOTTOM = 120;
  static readonly GROUND_HEIGHT_FROM_TOP = GlobalConstants.CANVAS_HEIGHT - GlobalConstants.GROUND_HEIGHT_FROM_BOTTOM - GlobalConstants.PLAYER_HEIGHT;

  //Physics Constants
  static readonly FRICTION = 0.9;
  static readonly GRAVITATION = 1.2;

  //Time and Frames Constants
  static readonly FRAMES_PER_SECOND = 60;

  //Acceleration Constants
  static readonly ACCELERATION_X = 1.5;
  static readonly ACCELERATION_Y = 1.5;

  //Level Settings Constants
  static readonly SOLID_WALLS = true;
  static readonly SOLID_ROOF = true;

}
