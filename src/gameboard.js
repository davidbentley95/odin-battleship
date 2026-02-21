class Gameboard {
  constructor() {
    this.missedShots = [];
    this.map = new Map();
    this.orientation = 0; // 0 === vertical, 1 === horizontal
  }

  _isValidCoordinate(coord) {
    if (coor[0] < 1 || coord[0] > 10 || coord[1] < 1 || coord[1] > 10) {
      throw new Error("Invalid coordinate, must be between 1 and 10");
    }
  }

  placeShip(ship, coord) {
    this._isValidCoordinate(coord);

    if (this.orientation === 0) {
      for (let i = 1; i <= ship.length; i++) {
        coord[0]++;
        this.map.set(coord, ship);
      }
    } else if(this.orientation === 1) {
        for (let i = 1; i <= ship.length; i++) {
            coord[1]++;
            this.map.set(coord, ship);
      }
    }
  }
}
