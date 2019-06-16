import { GlobalConstants as CONSTS} from "./GlobalConstants";
import { Player } from "./Player";

export class Game {
  private players:[Player, Player];

  constructor() {
    this.players = [
      new Player("red", {'x':CONSTS.PLAYER_1_START_X_COORDS, 'y':0}),
      new Player("blue", {'x':CONSTS.PLAYER_2_START_X_COORDS, 'y':1})
    ];
  }

  getPlayers():[Player, Player]{
    return this.players;
  }
}
