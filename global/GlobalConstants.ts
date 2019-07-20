export class GlobalConstants{
  //Network Constants
  static readonly PORT: number = 3000;
  static readonly MAX_PLAYERS: number = 2;
  static readonly SERVER_URL: string = `http://localhost:${GlobalConstants.PORT}`;
  static readonly ASSET_FOLDER: string = "assets/"
  static readonly WAITING_TIME: number = 3000;

  //Game Start Constants
  static readonly WINNER_INITIAL_STATE: number = -1;
  static readonly TIME_INITIAL_STATE: number = -1;
  static readonly ID_INITIAL_STATE: number = -1;
  static readonly READY_PLAYERS_INITIAL_STATE: Array<boolean> = [undefined,false,false];
  static readonly PROFILE_PICTURE_POSITION: {x: number, y: number} = {x: 390, y: 230};
  static readonly PROFILE_PICTURE_SIZE: number = 300;
  static readonly READY_STATE_POSITION: {x: number, y: number} = {x: 340, y: 180};
  static readonly READY_STATE_SIZE: number = GlobalConstants.PROFILE_PICTURE_SIZE + 100;

  //Grid Constants
  static readonly GRID_HEIGHT: number = 19; //Blocks
  static readonly GRID_WIDTH: number = 27; //Blocks
  static readonly BLOCK_HEIGHT: number = 40; //Pixels per Block
  static readonly BLOCK_WIDTH: number = 40; // Pixels per Block

  //Canvas Constants
  static readonly CANVAS_HEIGHT: number = GlobalConstants.GRID_HEIGHT * GlobalConstants.BLOCK_HEIGHT; //760 Pixels
  static readonly CANVAS_WIDTH: number = GlobalConstants.GRID_WIDTH * GlobalConstants.BLOCK_WIDTH; //1080 Pixels
  static readonly FOREGROUND_HEIGHT: number = 200;

  //Character Constants
  static readonly PLAYER_HEIGHT: number = 120;
  static readonly PLAYER_WIDTH: number  = 120;
  static readonly JUMP_HEIGHT: number = 50;

  static readonly PLAYER_1_START_X_COORDS: number = GlobalConstants.PLAYER_WIDTH;
  static readonly PLAYER_2_START_X_COORDS: number = GlobalConstants.CANVAS_WIDTH - GlobalConstants.PLAYER_WIDTH - GlobalConstants.PLAYER_WIDTH;

  //Action Constants
  static readonly SHOOT_OBJECT_SIZE: number = 40;
  static readonly SHOOT_OBJECT_SPEED: number = 22;
  static readonly TARGET_SIZE: number = GlobalConstants.SHOOT_OBJECT_SIZE;
  static readonly DEFENSE_SIZE: number = 160;
  static readonly DEFENSE_Y_DIFF: number = 29;
  static readonly DEFENSE_X_DIFF: number = 20;

  //Level Constants
  static readonly GROUND_HEIGHT_FROM_BOTTOM: number = 120;
  static readonly GROUND_HEIGHT_Y: number = GlobalConstants.CANVAS_HEIGHT - GlobalConstants.GROUND_HEIGHT_FROM_BOTTOM;
  static readonly GROUND_HEIGHT_FROM_TOP: number = GlobalConstants.GROUND_HEIGHT_Y - GlobalConstants.PLAYER_HEIGHT;

  //Physics Constants
  static readonly FRICTION: number = 0.9;
  static readonly GRAVITATION: number = 1.2;

  //Timer and Frames Constants
  static readonly START_ANGLE: number = -0.5 * Math.PI;
  static readonly TIMER_X: number = GlobalConstants.CANVAS_WIDTH / 2; //in the middle of the canvas
  static readonly TIMER_Y: number = 70;
  static readonly TIMER_RADIUS: number = GlobalConstants.BLOCK_WIDTH;
  static readonly CALCULATIONS_PER_SECOND: number = 60;
  static readonly COUNTDOWN: number = 120;
  static readonly ANIMATION_TIME: number = 300;
  static readonly TIMER_COLOR: string = "#F5A9AF";

  //Life Bar Constants
  static readonly MAX_HP: number = 200;
  static readonly DAMAGE: number = 20;
  static readonly HALF_DAMAGE: number = 0.25 * GlobalConstants.DAMAGE;
  static readonly LIFE_BAR_FRAME_WIDTH: number = 360;
  static readonly LIFE_BAR_FRAME_HEIGHT: number = 120;
  static readonly LIFE_BAR_FRAME_1_COORDS: {x: number, y: number} = {x: 10, y: 0};
  static readonly LIFE_BAR_FRAME_2_COORDS: {x: number, y: number} = {x: 710, y: 0};
  static readonly LIFE_BAR_WIDTH: number = 240;
  static readonly LIFE_BAR_HEIGHT: number = 80;
  static readonly LIFE_BAR_POINT: number = GlobalConstants.LIFE_BAR_WIDTH / GlobalConstants.MAX_HP;
  static readonly LIFE_BAR_1_COORDS: {x: number, y: number} = {x: 115, y: 20};
  static readonly LIFE_BAR_2_COORDS: {x: number, y: number} = {x: 725, y: 20};

  //Game Over Constants
  static readonly GAMEOVER_WINNER: {x: number, y: number} = {x: 450, y: 330};
  static readonly GAMEOVER_WINNER_SIZE: number = 180;
  static readonly GAMEOVER_LOSER: {x: number, y: number} = {x: 445, y: 355};
  static readonly GAMEOVER_LOSER_SIZE: number = 190;

  //Acceleration Constants
  static readonly ACCELERATION_X: number = 1.5;
  static readonly ACCELERATION_Y: number = 1.5;

  //Level Settings Constants
  static readonly SOLID_WALLS: boolean = true;
  static readonly SOLID_ROOF: boolean = true;
  static readonly WITH_GRID: boolean = true;
  static readonly UNLIMITED_PLAYERS: boolean = false;
  static readonly FALL_THROUGH_BLOCKS: boolean = true;

  //The character is falling off the edge oddly if the edge is
  //solid on its whole width
  static readonly PERMEABLE_EDGES: number = 35; // >= 0 but < than BLOCK_WIDTH

  //When a character has to be set back on the top of a block,
  //it is first calibrated how deep they collide until this happens
  static readonly SETBACK: number = 30; // < BLOCK_HEIGHT


  //Grid and block rules/constraints
  static readonly MIN_BLOCK_POSITION_Y : number = (GlobalConstants.GROUND_HEIGHT_FROM_TOP + GlobalConstants.BLOCK_HEIGHT) / GlobalConstants.BLOCK_HEIGHT;
  static readonly MAX_BLOCK_POSITION_Y : number = (GlobalConstants.PLAYER_HEIGHT + GlobalConstants.BLOCK_HEIGHT) / GlobalConstants.BLOCK_HEIGHT;

  //Grid for 1080x640 px canvas
  //1: Blocks; 0: No Blocks
  static readonly GRID_1 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //1
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //2
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //3
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //4
    [1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //5 MAX Block Position: player with defense wont be cut off
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0], //6
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //7
    [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0], //8
    [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //9
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //10
    [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0], //11
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1], //12
    [0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0], //13 MIN Block Position: player can run on the ground freely without bumping into any clouds
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //14
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //15
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //16
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //17 Ground
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //18
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  //19
  ];
}
