import { player1, player2 } from "../controllers/gameController.js";


function createBoardGrid(player) {
    const boardSize = player.gameboard.size * player.gameboard.size;
    const parentDiv = document.createElement("div");
    parentDiv.id = player.playerID;

    const size = player.gameboard.size;
    parentDiv.style.setProperty("--n", size);

    const main = document.querySelector("main");
    main.appendChild(parentDiv);

    for(let i = 1; i <= boardSize; i++) {
        const div = document.createElement("div");
        div.classList.add("board-cell");
        parentDiv.appendChild(div);
    }
}

export function initUI() {
    createBoardGrid(player1);
    createBoardGrid(player2);
};