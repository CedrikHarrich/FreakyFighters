import { Player } from './Player';
import { clientList } from './clientList';
import { GlobalConstants as Const } from '../global/GlobalConstants';
import { Keys } from '../global/Keys';
import { GameState } from '../global/GameState';
import { PlayerState } from "../global/PlayerState";
import { ShootActionState } from "../global/ShootActionState";
import { CollisionDetection } from './CollisionDetection';

export class GameLogicHandler {
    private clientList: clientList;
    private gameState: GameState;


    constructor(clientList: clientList, gameState: GameState){
        this.clientList = clientList;
        this.gameState = gameState;
    };

    

}