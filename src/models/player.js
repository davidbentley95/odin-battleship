import Gameboard from "./gameboard.js"
import Ship from "./ship.js"

export default class Player {
  constructor(playerID, size = 10) {
    this.gameboard = new Gameboard(size);
    this.playerID = playerID;
    this.score = 0;
    this.fleet = [
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
    ];
  }

  presetShipPlacement() {
    this.gameboard.placeShip(this.fleet[0],"1,1", "vertical");
    this.gameboard.placeShip(this.fleet[1],"4,5", "horizontal");
    this.gameboard.placeShip(this.fleet[2],"2,7", "vertical");
    this.gameboard.placeShip(this.fleet[3],"3,3", "horizontal");
    this.gameboard.placeShip(this.fleet[4],"8,4", "vertical");
  }
}
