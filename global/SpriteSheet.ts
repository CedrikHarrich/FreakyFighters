import { GlobalConstants as Const } from "../global/GlobalConstants"

export class SpriteSheet{

    //Sprite Constants
    static readonly SPRITE_SIZE: number = 160;

    //Game Start
    static readonly PLAYER_NOT_READY: {x: number, y: number} = {x: 0, y: 2};
    static readonly PLAYER_READY: {x: number, y: number} = {x: 2, y: 1};
    static readonly PROFILPICTURE: { x: number, y: number} = {x: 0, y: 3};

    //Screens
    static readonly START_SCREEN: {x: number, y: number} = {x: 0, y: 3 * Const.CANVAS_HEIGHT};
    static readonly FOREGROUND: {x: number, y: number} = {x: 0, y: 4 * Const.CANVAS_HEIGHT};
    static readonly BACKGROUND: {x: number, y: number} = {x: 0, y: 0 * Const.CANVAS_HEIGHT};
    static readonly WINNER_SCREEN: {x: number, y: number} = {x: 0, y: 1 * Const.CANVAS_HEIGHT};
    static readonly LOSER_SCREEN: {x: number, y: number} = {x: 0, y: 2 * Const.CANVAS_HEIGHT};

    //Clouds
    static readonly CLOUD_LEFT: {x: number, y: number} = {x: 0, y: 0};
    static readonly CLOUD_MIDDLE: {x: number, y: number} = {x: 1, y: 0};
    static readonly CLOUD_RIGHT: {x: number, y: number} = {x: 2, y: 0};

    //Player Character
    static readonly PLAYER_LEFT: {x: number, y: number} = {x: 0, y: 2};
    static readonly PLAYER_FRONT: {x: number, y: number} = {x: 1, y: 2};
    static readonly PLAYER_RIGHT: {x: number, y: number} = {x: 2, y: 2};
    static readonly PLAYER_SHOOTING: {x: number, y: number} = {x: 1, y: 5};
    static readonly PLAYER_HIT: {x: number, y: number} = {x: 2, y: 5};

    //Life Bar
    static readonly LIFE_BAR_FRAME: {x: number, y: number} = {x: 0, y: 1};
    static readonly LIFE_BAR: {x: number, y: number} = {x: 0, y: 0};
    
    //Action
    static readonly SHOOT: {x: number, y: number} = {x: 1, y: 3};
    static readonly TARGET: {x: number, y: number} = {x: 2, y: 3};
    static readonly DEFENSE_GROUND: {x: number, y: number} = {x: 0, y: 1};
    static readonly DEFENSE_AIR: {x: number, y: number} = {x: 1, y: 1};
    static readonly HIT_DEFENSE_GROUND: {x: number, y: number} = {x: 1, y: 4};
    static readonly HIT_DEFENSE_AIR: {x: number, y: number} = {x: 2, y: 4};
    
    //Game Over
    static readonly LOSER: {x: number, y: number} = {x: 0, y: 4};
    static readonly WINNER: {x: number, y: number} = {x: 0, y: 5};

}