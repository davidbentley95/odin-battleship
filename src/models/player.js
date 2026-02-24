const { Gameboard } = require("./gameboard");

class Player {
    constructor() {
        this.gameboard = new Gameboard();
        this.score = 0;
    }
};

module.exports = { Player }

