import { player1, player2, getPlayerTurn, setPlayerTurn } from "../controllers/gameController.js";

function createBoardGrid(player) {
  const boardSize = player.gameboard.size;
  const parentDiv = document.createElement("div");
  parentDiv.id = player.playerID;

  parentDiv.style.setProperty("--n", boardSize);

  const main = document.querySelector("main");
  main.appendChild(parentDiv);

  let coordinates = [0, 0];

  for (let i = 1; i <= boardSize; i++) {
    for (let j = 1; j <= boardSize; j++) {
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

  player1.gameboard.occupied.keys().forEach((key) => {
    const target = [...cells].find((cell) => cell.textContent.trim() === key);

    target.style.setProperty("background-color", "blue");
  });
}

function updateTurn(playerTurn) {
    let turnHeader = document.querySelector(".player-turn-header");
    if(playerTurn === 0) {
        turnHeader.textContent = "Player Turn: Player 1";
    } else {
        turnHeader.textContent = "Player Turn: Player 2";
    }
}

function toggleInactiveClass(firstPlayer, secondPlayer) {
    firstPlayer.classList.toggle("inactive");
    secondPlayer.classList.toggle("inactive");
}

export function initUI() {
  createBoardGrid(player1);
  createBoardGrid(player2);

  const player1Board = document.querySelector("#player1");
  const player2Board = document.querySelector("#player2");

  player1Board.classList.toggle("inactive");
  placeShips();

  //event listeners
  document.querySelector("#player1").addEventListener("click", (event) => {
    const cell = event.target.closest(".board-cell");
    if (!cell) {
      return;
    }
    setPlayerTurn(0);
    updateTurn(getPlayerTurn());
    console.log(event.target.innerHTML);
    toggleInactiveClass(player1Board, player2Board);
  });

  document.querySelector("#player2").addEventListener("click", (event) => {
    const cell = event.target.closest(".board-cell");
    if (!cell) {
      return;
    }
    setPlayerTurn(1);
    updateTurn(getPlayerTurn());
    console.log(event.target.innerHTML);
    toggleInactiveClass(player1Board, player2Board);
  });
}
