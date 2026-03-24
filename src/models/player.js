import Gameboard from "./gameboard.js";
import Ship from "./ship.js";

export default class Player {
  constructor(playerID, size = 10) {
    this.gameboard = new Gameboard(size);
    this.size = size;
    this.playerID = playerID;
    this.score = 0;
    this.fleet = [];
    this.playedMoves = new Set();
    this.lastMove = "";
    this.firstFoundHit = "";
    this.lastMoveHit = false;
    this.nextMove = "";
    this.foundShip = false;
    this.failedSearchAttempt = 0;
    this.successfulSearchAttemps = 0;
  }

  resetGameBoard() {
    this.gameboard = new Gameboard(this.size);
    this.fleet = [];
    this.playedMoves = new Set();
    this.lastMove = "";
    this.firstFoundHit = "";
    this.lastMoveHit = false;
    this.nextMove = "";
    this.foundShip = false;
    this.failedSearchAttempt = 0;
    this.successfulSearchAttemps = 0;
  }

  presetShipPlacement() {
    this.gameboard.placeShip(new Ship(5), "1,1", "vertical");
    this.gameboard.placeShip(new Ship(4), "7,5", "horizontal");
    this.gameboard.placeShip(new Ship(3), "2,7", "vertical");
    this.gameboard.placeShip(new Ship(3), "10,3", "horizontal");
    this.gameboard.placeShip(new Ship(2), "10,9", "horizontal");
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
      if (!this._isValidCoordinate(testArr)) return false;

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
    let ships = [5, 4, 3, 3, 2];

    for (let i = 0; i < 5; i++) {
      const ship = new Ship(ships[i]);
      const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

      let row = this._getRandomInt(1, 10);
      let col = this._getRandomInt(1, 10);

      let coordStr = `${row},${col}`;
      let coordArr = [];
      coordArr.push(row, col);

      while (!this._validMove(ship, coordArr, direction)) {
        row = this._getRandomInt(1, 10);
        col = this._getRandomInt(1, 10);

        coordStr = `${row},${col}`;
        coordArr = [];
        coordArr.push(row, col);
      }
      this.gameboard.placeShip(ship, coordStr, direction);
    }
  }

  determineNextMove() {
    if (this.lastMoveHit === false) {
      this.failedSearchAttempt++;
    }

    let firstHit = this.firstFoundHit;
    let previousMoveArray = firstHit.split(",");
    
    switch (this.failedSearchAttempt) {
      case 0: //go left
        let leftAttackArray = [...previousMoveArray];
        leftAttackArray[1] = Number(leftAttackArray[1]) - this.successfulSearchAttemps;
        let leftAttackString = leftAttackArray.join(",");
        if (
          this._isValidCoordinate(leftAttackArray) &&
          !this.playedMoves.has(leftAttackString)
        ) {
          this.nextMove = leftAttackString;
          break;
        }
      this.failedSearchAttempt++;
      this.successfulSearchAttemps = 1;
      case 1: //go right
        let rightAttackArray = [...previousMoveArray];
        rightAttackArray[1] = Number(rightAttackArray[1]) + this.successfulSearchAttemps;
        let rightAttackString = rightAttackArray.join(",");
        if (
          this._isValidCoordinate(rightAttackArray) &&
          !this.playedMoves.has(rightAttackString)
        ) {
          this.nextMove = rightAttackString;
          break;
        }
      this.failedSearchAttempt++;
      this.successfulSearchAttemps = 1;
      case 2: //go up
        let upAttackArray = [...previousMoveArray];
        upAttackArray[0] = Number(upAttackArray[0]) - this.successfulSearchAttemps;
        let upAttackString = upAttackArray.join(",");
        if (
          this._isValidCoordinate(upAttackArray) &&
          !this.playedMoves.has(upAttackString)
        ) {
          this.nextMove = upAttackString;
          break;
        }
      this.failedSearchAttempt++;
      this.successfulSearchAttemps = 1;
      case 3: //go down
        let downAttackArray = [...previousMoveArray];
        downAttackArray[0] = Number(downAttackArray[0]) + this.successfulSearchAttemps;
        let downAttackString = downAttackArray.join(",");
        if (
          this._isValidCoordinate(downAttackArray) &&
          !this.playedMoves.has(downAttackString)
        ) {
          this.nextMove = downAttackString;
          break;
        }
        this.foundShip = false;
        this.failedSearchAttempt = 4;
        this.successfulSearchAttemps = 0;
        this.nextMove = this.randomMove();
    }
  }

  randomMove() {
    if (this.foundShip && this.failedSearchAttempt !== 4) {
      this.determineNextMove();
      this.lastMove = this.nextMove;
      this.playedMoves.add(this.nextMove);
      return this.nextMove;
    } else {
      this.successfulSearchAttemps = 0;
      this.failedSearchAttempt = 0;
      let row = this._getRandomInt(1, 10);
      let col = this._getRandomInt(1, 10);

      let coordStr = `${row},${col}`;

      while (this.playedMoves.has(coordStr)) {
        row = this._getRandomInt(1, 10);
        col = this._getRandomInt(1, 10);

        coordStr = `${row},${col}`;
      }

      this.lastMove = coordStr;
      this.playedMoves.add(coordStr);
      return coordStr;
    }
  }
}
