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
    this.gameboard.placeShip(fleet[0],"1,1", "vertical");
    this.gameboard.placeShip(fleet[1],"4,5", "horizontal");
    this.gameboard.placeShip(fleet[2],"10,3", "vertical");
    this.gameboard.placeShip(fleet[3],"3,3", "horizontal");
    this.gameboard.placeShip(fleet[4],"8,4", "vertical");
  }
}
