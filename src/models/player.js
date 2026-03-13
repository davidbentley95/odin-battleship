import Gameboard from "./gameboard.js"
import Ship from "./ship.js"

export default class Player {
  constructor(playerID, size = 10) {
    this.gameboard = new Gameboard(size);
    this.playerID = playerID;
    this.score = 0;
    this.fleet = [];
  }

  presetShipPlacement() {
    this.gameboard.placeShip(new Ship(5),"1,1", "vertical");
    this.gameboard.placeShip(new Ship(4),"7,5", "horizontal");
    this.gameboard.placeShip(new Ship(3),"2,7", "vertical");
    this.gameboard.placeShip(new Ship(3),"10,3", "horizontal");
    this.gameboard.placeShip(new Ship(2),"10,9", "horizontal");
  }

  placeShip(shipLength, coordinates, direction) {
    const boat = new Ship(shipLength);
    this.gameboard.placeShip(boat, coordinates, direction);
    this.fleet.push(boat);
  }
}
