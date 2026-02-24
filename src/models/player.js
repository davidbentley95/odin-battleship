const { Gameboard } = require("../src/models/gameboard");

class Player {
    constructor() {
        this.gameboard = new Gameboard();
        this.score = 0;
    }
};

module.exports = { Player }

