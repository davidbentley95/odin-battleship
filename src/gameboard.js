class Gameboard {
  constructor() {
    this.missedShots = [];
    this.hitShots = [];
    this.map = new Map();
    this.orientation = 0; // 0 === vertical, 1 === horizontal
  }

  _isValidCoordinate(coord) {
    if (coord[0] < 1 || coord[0] > 10 || coord[1] < 1 || coord[1] > 10) {
      throw new Error("Invalid coordinate, must be between 1 and 10");
    }
  }

  _convertStrtoNumberArr(coordStr) {
    let strArr = [];
    for(let i = 0; i < coordStr.length; i++) {
        if(Number(coordStr[i])){
            strArr.push(Number(coordStr[i]));
        }
    }
    return strArr;
  }

  _coordIsUnplayed(coordStr) {
    if(this.missedShots.includes(coordStr) || this.hitShots.includes(coordStr)) {
        throw new Error("These coordinates were already played");
    }
  }

  placeShip(ship, coordStr) {
    let coordArr = this._convertStrtoNumberArr(coordStr);
    this._isValidCoordinate(coordArr);

    if (this.orientation === 0) {
      for (let i = 0; i < ship.length; i++) {
        if (i === 0) {
          this.map.set(coordStr, ship);
        } else {
          coordArr[0]++;
          this.map.set(coordArr.join(","), ship);
        }
      }
    } else if (this.orientation === 1) {
      for (let i = 0; i < ship.length; i++) {
        if(i === 0) {
            this.map.set(coordStr, ship);
        } else {
            coordArr[1]++;
            this.map.set(coordArr.join(","), ship);
        }
        
      }
    }
    return this.map;
  }

  receiveAttack(coordStr) {
    let coordArr = this._convertStrtoNumberArr(coordStr);
    this._isValidCoordinate(coordArr);
    this._coordIsUnplayed(coordStr);
    let ship = this.map.get(coordStr);

    if(ship){
        ship.hit();
        this.hitShots.push(coordStr);
        if(ship.isSunk()) {
            return ship.sunk;
        }
        return ship.hits;
    } else {
        this.missedShots.push(coordStr);
        return this.missedShots;
    }
    
  }
}

module.exports = { Gameboard };
