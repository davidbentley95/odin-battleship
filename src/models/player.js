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

  _getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

_isValidCoordinate(coord) {
    if (coord[0] < 1 || coord[0] > 10 || coord[1] < 1 || coord[1] > 10) {
      return false;
    }
    return true;
  }

_validMove(ship, coordArr, direction) {
    let testArr = [...coordArr];

    for (let i = 0; i < ship.length; i++) {
      if(!this._isValidCoordinate(testArr)) return false;

      const key = testArr.join(",");
      if (this.gameboard.occupied.has(key)) {
        return false;
      }

      if (direction === "vertical") {
        testArr[0]++;
      } else {
        testArr[1]++;
      }
    }
    return true;
  }


  randomShipPlacement() {
    let ships = [5,4,3,3,2];

    for(let i = 0; i < 5; i++) {
      const ship = new Ship(ships[i]);
      const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

      let row = this._getRandomInt(1, 10);
      let col = this._getRandomInt(1, 10);

      let coordStr = `${row},${col}`;
      let coordArr = [];
      coordArr.push(row, col);

      while(!this._validMove(ship, coordArr, direction)) {
        row = this._getRandomInt(1, 10);
        col = this._getRandomInt(1, 10);

        coordStr = `${row},${col}`;
        coordArr = [];
        coordArr.push(row, col);
      }
      console.log(ship, coordStr, direction);
      console.log("here")
      this.gameboard.placeShip(ship, coordStr, direction);
    }
    console.log(this.fleet);
  }
}
