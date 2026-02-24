const { Gameboard } = require("./gameboard");

class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.score = 0;
    this.fleet = [
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
    ];
  }

  placeFleetRandomly() {
    
  }
}

module.exports = { Player };
