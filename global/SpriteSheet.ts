export class SpriteSheet{
    //Sprite Consts
    static readonly LEFT_SPRITE: number = 0;
    static readonly MIDDLE_SPRITE : number = 1;
    static readonly RIGHT_SPRITE : number = 2;
    static readonly SPRITES_IN_ROW : number = 3;
    static readonly SPRITES_IN_COLUMN_SHARED : number = 2;
    static readonly SPRITES_IN_COLUMN: number = 6;


    //Game Start
    static readonly PROFILPICTURE: {x: number, y: number} = {x: 0, y: 3};

    //Clouds
    static readonly CLOUD_LEFT: {x: number, y: number} = {x: 0, y: 0};
    static readonly CLOUD_MIDDLE: {x: number, y: number} = {x: 1, y: 0};
    static readonly CLOUD_RIGHT: {x: number, y: number} = {x: 2, y: 0};

    //Player Character
    static readonly PLAYER_LEFT: {x: number, y: number} = {x: 0, y: 2};
    static readonly PLAYER_FRONT: {x: number, y: number} = {x: 1, y: 2};
    static readonly PLAYER_RIGHT: {x: number, y: number} = {x: 2, y: 2};
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