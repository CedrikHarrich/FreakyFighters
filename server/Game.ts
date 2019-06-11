import { Player } from "./Player";

export class Game {
  private players:[Player, Player];

  constructor() {
    this.players = [
      new Player("red", [0, 0]),
      new Player("blue", [1, 1])
    ];
  }

  getPlayers():[Player, Player]{
    return this.players;
  }
}
