import { player1, player2 } from "../controllers/gameController.js";


function createBoardGrid(player) {
    const boardSize = player.gameboard.size;
    const parentDiv = document.createElement("div");
    parentDiv.id = player.playerID;

    parentDiv.style.setProperty("--n", boardSize);

    const main = document.querySelector("main");
    main.appendChild(parentDiv);

    let coordinates = [0,0]

    for(let i = 1; i <= boardSize; i++) {
        for(let j = 1; j <= boardSize; j++) {
            coordinates[0] = i;
            coordinates[1] = j;
            const div = document.createElement("div");
            div.classList.add("board-cell");
            div.textContent = coordinates.join(",");
            parentDiv.appendChild(div);
        }
    }
}

function placeShips() {
    const cells = document.querySelectorAll(".board-cell");

    player1.gameboard.occupied.keys().forEach(key => {
    const target = [...cells].find(
    cell => cell.textContent.trim() === key);
    
    target.style.setProperty("background-color", "blue")
    console.log(target)
})
}

export function initUI() {
    createBoardGrid(player1);
    createBoardGrid(player2);
    placeShips();
};