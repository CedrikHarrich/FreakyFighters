export class GlobalConstants{
  //Network Constants
  static readonly PORT : number = 3000;
  static readonly MAX_CLIENTS : number = 2;
  static readonly SERVER_URL : string = `http://localhost:${GlobalConstants.PORT}`;
  static readonly ASSET_FOLDER : string = "assets/"
  static readonly WAITING_TIME : number = 3000;

  //Grid Constants
  static readonly GRID_HEIGHT : number = 16; //Blocks
  static readonly GRID_WIDTH : number = 27; //Blocks
  static readonly BLOCK_HEIGHT : number = 40; //Pixels per Block
  static readonly BLOCK_WIDTH : number = 40; // Pixels per Block

  //Canvas Constants
  static readonly CANVAS_HEIGHT : number = GlobalConstants.GRID_HEIGHT * GlobalConstants.BLOCK_HEIGHT; //640 Pixels
  static readonly CANVAS_WIDTH : number = GlobalConstants.GRID_WIDTH * GlobalConstants.BLOCK_WIDTH; //1080 Pixels
  static readonly FOREGROUND_HEIGHT : number = 200;

  //Life bar Constants
  static readonly DISPLAY_LIFE_BAR_WIDTH : number = 360;
  static readonly DISPLAY_LIFE_BAR_HEIGHT : number = 120; //eigentlich 100, aber auf spritesheet format 120
  static readonly DISPLAY_1_LIFE_BAR_X : number = 10;
  static readonly DISPLAY_2_LIFE_BAR_X : number = GlobalConstants.CANVAS_WIDTH - GlobalConstants.DISPLAY_LIFE_BAR_WIDTH - GlobalConstants.DISPLAY_1_LIFE_BAR_X;
  static readonly LIFE_BAR_DISPLAY_Y : number = 0;
  static readonly PROFILPICTURE_SIZE : number = 80;
  static readonly PROFIL_1_PICTURE_X : number = GlobalConstants.DISPLAY_1_LIFE_BAR_X + 10;
  static readonly PROFIL_2_PICTURE_X : number = GlobalConstants.DISPLAY_2_LIFE_BAR_X + 10;
  static readonly PROFILPICTURE_Y: number = GlobalConstants.LIFE_BAR_DISPLAY_Y + 20;
  static readonly LIFE_BAR_WIDTH : number = 240;
  static readonly LIFE_BAR_HEIGHT : number = GlobalConstants.PROFILPICTURE_SIZE;
  static readonly LIFE_BAR_1_X : number = GlobalConstants.PROFIL_1_PICTURE_X + GlobalConstants.PROFILPICTURE_SIZE + 15 ;
  static readonly LIFE_BAR_2_X : number = GlobalConstants.PROFIL_2_PICTURE_X + GlobalConstants.PROFILPICTURE_SIZE + 15 ;
  static readonly LIFE_BAR_1_Y : number = GlobalConstants.PROFILPICTURE_Y;
  //relavant for Player, compare to player.currentHealth 
  static readonly LIFE_NUMBER : number = 10;
  //to draw the life bar depending on currentHealth
  static readonly LIFE_SIZE : number = GlobalConstants.LIFE_BAR_WIDTH / GlobalConstants.LIFE_NUMBER; 

  


  //Character Constants
  static readonly PLAYER_HEIGHT : number = 120;
  static readonly PLAYER_WIDTH : number  = 120;
  static readonly JUMP_HEIGHT = 50; //old: 65

  static readonly PLAYER_1_START_X_COORDS : number = GlobalConstants.PLAYER_WIDTH;
  static readonly PLAYER_2_START_X_COORDS : number = GlobalConstants.CANVAS_WIDTH - GlobalConstants.PLAYER_WIDTH - GlobalConstants.PLAYER_WIDTH;
  
  //Action Constants
  static readonly SHOOT_OBJECT_SIZE : number = 40;
  static readonly SHOOT_OBJECT_SPEED : number = 18;
  static readonly TARGET_SIZE : number = GlobalConstants.SHOOT_OBJECT_SIZE;
  static readonly BUBBLES_SIZE : number = 160;
  static readonly BUBBLES_Y_DIFF : number = 29;
  static readonly BUBBLES_X_DIFF : number = 20;

  //Level Constants
  static readonly GROUND_HEIGHT_FROM_BOTTOM = 120;
  static readonly GROUND_HEIGHT_Y = GlobalConstants.CANVAS_HEIGHT - GlobalConstants.GROUND_HEIGHT_FROM_BOTTOM;
  static readonly GROUND_HEIGHT_FROM_TOP = GlobalConstants.GROUND_HEIGHT_Y - GlobalConstants.PLAYER_HEIGHT;

  //Physics Constants
  static readonly FRICTION = 0.9;
  static readonly GRAVITATION = 1.2;

  //Time and Frames Constants
  static readonly FRAMES_PER_SECOND = 60;

  //Acceleration Constants
  static readonly ACCELERATION_X = 1.5;
  static readonly ACCELERATION_Y = 1.5;

  //Level Settings Constants
  static readonly SOLID_WALLS = false;
  static readonly SOLID_ROOF = true;
  static readonly WITH_GRID = true;
  static readonly UNLIMITED_PLAYERS = false;
  static readonly FALL_THROUGH_BLOCKS = true;

  //The character is falling off the edge oddly if the edge is
  //solid on its whole width.
  static readonly PERMEABLE_EDGES = 35; // >= 0 but < than BLOCK_WIDTH

  //When a character has to be set back on the top of a block, one
  //needs to calibrate how deep they colide until this happens.
  static readonly SETBACK = 30; // < BLOCK_HEIGHT

  //Spritesheet Constants
  //TODO: width, height, rows, columns
  static readonly LEFT_SPRITE = 0;
  static readonly MIDDLE_SPRITE = 1;
  static readonly RIGHT_SPRITE = 2;
  static readonly SPRITES_IN_ROW = 3;
  //static readonly SPRITES_IN_COLUMN

  //grid and block rules
  static readonly MIN_BLOCK_POSITION_Y : number = GlobalConstants.GROUND_HEIGHT_FROM_TOP/GlobalConstants.BLOCK_HEIGHT; //MinPosition: 10
  static readonly MAX_BLOCK_POSITION_Y : number = GlobalConstants.PLAYER_HEIGHT/GlobalConstants.BLOCK_HEIGHT + 1;

  //Grid for 1080x640 px canvas
  //1: Blocks; 0: No Blocks
  static readonly TEST_GRID_27x16 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //1
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //2
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //3
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //4 highest possible block element for clouds: player no defence
    [0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0], //5 highest possible block element for clouds: player with defence
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //6
    [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1], //7
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //8
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0], //9
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //10 lowest possible block element for clouds
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //11
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //12
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //13
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //14 highest possible block elemets for ground
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //15
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  //16
  ];
}
