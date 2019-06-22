export class GlobalConstants {
  //Network Constants
  static readonly PORT : number = 3000;
  static readonly MAX_CLIENTS : number = 2;
  static readonly SERVER_URL : string = `http://localhost:${GlobalConstants.PORT}`;
  static readonly ASSET_FOLDER : string = "assets/"

  //Grid Constants
  static readonly GRID_HEIGHT : number = 16; //Blocks
  static readonly GRID_WIDTH : number = 24; //Blocks
  static readonly BLOCK_HEIGHT : number = 40; //Pixels per Block
  static readonly BLOCK_WIDTH : number = 40; // Pixels per Block

  static readonly TEST_GRID_24x16 = [
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], //1
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //2
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //3
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //4
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //5
    [0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0], //6
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //7
    [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0], //8
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //9
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //10
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //11
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //12
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //13
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //14
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //15
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1]  //16
  ];

  //Canvas Constants
  static readonly CANVAS_HEIGHT : number = GlobalConstants.GRID_HEIGHT * GlobalConstants.BLOCK_HEIGHT;
  static readonly CANVAS_WIDTH : number = GlobalConstants.GRID_WIDTH * GlobalConstants.BLOCK_WIDTH;

  //Character Constants
  static readonly PLAYER_HEIGHT : number = 120;
  static readonly PLAYER_WIDTH : number  = 120;
  static readonly JUMP_HEIGHT = 65;

  static readonly PLAYER_1_START_X_COORDS : number = 140;
  static readonly PLAYER_2_START_X_COORDS : number = 820;

  //Level Constants
  static readonly GROUND_HEIGHT_FROM_BOTTOM = 80;
  static readonly GROUND_HEIGHT_FROM_TOP = GlobalConstants.CANVAS_HEIGHT - GlobalConstants.GROUND_HEIGHT_FROM_BOTTOM - GlobalConstants.PLAYER_HEIGHT;

  //Physics Constants
  static readonly FRICTION = 0.9;
  static readonly GRAVITATION = 1.2;

  //Time and Frames Constants
  static readonly FRAMES_PER_SECOND = 60;

  //Acceleration Constants
  static readonly ACCELERATION_X = 1.5;
  static readonly ACCELERATION_Y = 2.0;

  //Level Settings Constants
  static readonly SOLID_WALLS = true;
  static readonly SOLID_ROOF = true;
  static readonly WITH_GRID = true;


}
