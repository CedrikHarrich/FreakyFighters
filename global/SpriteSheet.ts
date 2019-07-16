import { GlobalConstants as Const } from "../global/GlobalConstants"

export class SpriteSheet{

    //Sprite Consts
    static readonly SPRITES_IN_ROW: number = 3;
    static readonly SPRITES_IN_COLUMN_SHARED: number = 2; //for clouds and defense without being hitted
    static readonly SPRITES_IN_COLUMN: number = 6; //player spritesheet
    static readonly SPRITE_SIZE: number = 160;

    //Game Start
    static readonly PROFILPICTURE: {x: number, y: number} = {x: 0, y: 3 * SpriteSheet.SPRITE_SIZE};

    //Screens
    static readonly FOREGROUND: {x: number, y: number} = {x: 0, y: 3 * Const.CANVAS_HEIGHT};
    static readonly BACKGROUND: {x: number, y: number} = {x: 0, y: 0 * Const.CANVAS_HEIGHT};
    static readonly WINNER_SCREEN: {x: number, y: number} = {x: 0, y: 1 * Const.CANVAS_HEIGHT};
    static readonly LOSER_SCREEN: {x: number, y: number} = {x: 0, y: 2 * Const.CANVAS_HEIGHT};



    //Clouds
    static readonly CLOUD_LEFT: {x: number, y: number} = {x: 0 * SpriteSheet.SPRITE_SIZE, y: 0 * SpriteSheet.SPRITE_SIZE};
    static readonly CLOUD_MIDDLE: {x: number, y: number} = {x: 1 * SpriteSheet.SPRITE_SIZE, y: 0 * SpriteSheet.SPRITE_SIZE};
    static readonly CLOUD_RIGHT: {x: number, y: number} = {x: 2 * SpriteSheet.SPRITE_SIZE, y: 0 * SpriteSheet.SPRITE_SIZE};

    //Player Character
    static readonly PLAYER_LEFT: {x: number, y: number} = {x: 0 * SpriteSheet.SPRITE_SIZE, y: 2 * SpriteSheet.SPRITE_SIZE};
    static readonly PLAYER_FRONT: {x: number, y: number} = {x: 1 * SpriteSheet.SPRITE_SIZE, y: 2 * SpriteSheet.SPRITE_SIZE};
    static readonly PLAYER_RIGHT: {x: number, y: number} = {x: 2 * SpriteSheet.SPRITE_SIZE, y: 2 * SpriteSheet.SPRITE_SIZE};
    static readonly PLAYER_SHOOTING: {x: number, y: number} = {x: 1 * SpriteSheet.SPRITE_SIZE, y: 5 * SpriteSheet.SPRITE_SIZE};
    static readonly PLAYER_HIT: {x: number, y: number} = {x: 2 * SpriteSheet.SPRITE_SIZE, y: 5 * SpriteSheet.SPRITE_SIZE};

    //Life Bar
    static readonly LIFE_BAR_FRAME: {x: number, y: number} = {x: 0, y: 1 * SpriteSheet.SPRITE_SIZE};
    static readonly LIFE_BAR: {x: number, y: number} = {x: 0 * SpriteSheet.SPRITE_SIZE, y: 0 * SpriteSheet.SPRITE_SIZE};
    
    //Action
    static readonly SHOOT: {x: number, y: number} = {x: 1 * SpriteSheet.SPRITE_SIZE, y: 3 * SpriteSheet.SPRITE_SIZE};
    static readonly TARGET: {x: number, y: number} = {x: 2 * SpriteSheet.SPRITE_SIZE, y: 3 * SpriteSheet.SPRITE_SIZE};
    static readonly DEFENSE_GROUND: {x: number, y: number} = {x: 0 * SpriteSheet.SPRITE_SIZE, y: 1 * SpriteSheet.SPRITE_SIZE};
    static readonly DEFENSE_AIR: {x: number, y: number} = {x: 1 * SpriteSheet.SPRITE_SIZE, y: 1 * SpriteSheet.SPRITE_SIZE};
    static readonly HIT_DEFENSE_GROUND: {x: number, y: number} = {x: 1 * SpriteSheet.SPRITE_SIZE, y: 4 * SpriteSheet.SPRITE_SIZE};
    static readonly HIT_DEFENSE_AIR: {x: number, y: number} = {x: 2 * SpriteSheet.SPRITE_SIZE, y: 4 * SpriteSheet.SPRITE_SIZE};
    
    //Game Over
    static readonly LOSER: {x: number, y: number} = {x: 0 * SpriteSheet.SPRITE_SIZE, y: 4 * SpriteSheet.SPRITE_SIZE};
    static readonly WINNER: {x: number, y: number} = {x: 0 * SpriteSheet.SPRITE_SIZE, y: 5 * SpriteSheet.SPRITE_SIZE};

}