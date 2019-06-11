import { GlobalConstants as CONSTS} from "./GlobalConstants";
import { Player } from "./Player";

export class Game {
  private players:[Player, Player];

  constructor() {
    this.players = [
      new Player("red", [CONSTS.PLAYER_1_START_X_COORDS, 0]),
      new Player("blue", [CONSTS.PLAYER_2_START_X_COORDS, 1])
    ];
  }

  getPlayers():[Player, Player]{
    return this.players;
  }
}
