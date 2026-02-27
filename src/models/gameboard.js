export default class Gameboard {
  constructor(size) {
    this.size = size;
    this.missedShots = new Set();
    this.hitShots = new Set();
    this.occupied = new Map();
    this.ships = [];
    this.sunkShips = new Set();
  }

  _isValidCoordinate(coord) {
    if (coord[0] < 1 || coord[0] > 10 || coord[1] < 1 || coord[1] > 10) {
      throw new Error("Invalid coordinate, must be between 1 and 10");
    }
  }

  _convertStrtoNumberArr(coordStr) {
    const parts = coordStr.split(",");
    const coord = [Number(parts[0]), Number(parts[1])];

    if (Number.isNaN(coord[0]) || Number.isNaN(coord[1])) {
      throw new Error('Invalid coordinate format, must be "x,y"');
    }

    return coord;
  }

  _coordIsUnplayed(coordStr) {
    return !this.missedShots.has(coordStr) && !this.hitShots.has(coordStr);
  }

  _canPlaceShip(ship, coordArr, orientation) {
    let testArr = [...coordArr];

    for (let i = 0; i < ship.length; i++) {
      this._isValidCoordinate(testArr);

      const key = testArr.join(",");
      if (this.occupied.has(key)) {
        throw new Error("Invalid placement: ship overlap");
      }

      if (orientation === "vertical") {
        testArr[0]++;
      } else {
        testArr[1]++;
      }
    }

    return true;
  }

  placeShip(ship, coordStr, orientation) {
    if (orientation !== "vertical" && orientation !== "horizontal") {
      throw new Error('Invalid orientation, must be "vertical" or "horizontal"');
    }

    if (this.ships.includes(ship)) {
      throw new Error("This ship is already placed");
    }

    let coordArr = this._convertStrtoNumberArr(coordStr);
    this._isValidCoordinate(coordArr);
    this._canPlaceShip(ship, coordArr, orientation);

    for (let i = 0; i < ship.length; i++) {
      const key = coordArr.join(",");
      this.occupied.set(key, ship);

      if (orientation === "horizontal") coordArr[0]++;
      else coordArr[1]++;
    }

    this.ships.push(ship);
    return this.occupied;
  }

  receiveAttack(coordStr) {
    let coordArr = this._convertStrtoNumberArr(coordStr);
    this._isValidCoordinate(coordArr);

    if (!this._coordIsUnplayed(coordStr)) {
      return "These coordinates were already played";
    }

    let ship = this.occupied.get(coordStr);

    if (ship) {
      ship.hit();
      this.hitShots.add(coordStr);

      if (ship.isSunk()) {
        if (!this.sunkShips.has(ship)) {
          this.sunkShips.add(ship);
          return "sunk";
        }
        return "hit";
      }

      return "hit";
    } else {
      this.missedShots.add(coordStr);
      return "missed";
    }
  }

  gameOver() {
    return this.ships.length > 0 && this.ships.every((ship) => ship.isSunk());
  }
}
