import {
  player1,
  player2,
  playerTurn,
  playTurn,
  moveStatus,
  gameOver,
  winner,
  setOpponentType,
  setBoatLength,
  getBoatLength,
  setDirection,
  getDirection,
  getCurrentPlayer
} from "../controllers/gameController.js";

//event helpers
const changeCellColour = (event) => {
  let cell = event.target;
  let cellID = cell.id;
  let row = Number(cell.innerHTML.split(",")[0]);
  let column = Number(cell.innerHTML.split(",")[1]);
  let cellRow = 0;
  let cellColumn = 0;
  let visitedCells = [];

  for (let i = 1; i <= getBoatLength(); i++) {
    cell.style.backgroundColor = "lightblue";
    visitedCells.push(cell);
    cellRow = Number(cell.innerHTML.split(",")[0]);
    cellColumn = Number(cell.innerHTML.split(",")[1]);
    if(event.type === "click") {
      cell.classList.add("placed-ship")
    }
    if (getDirection() === "horizontal") {
      cell = cell.nextElementSibling;
    } else {
      let nextCellID = String(Number(cellID) + 10);
      cell = document.getElementById(nextCellID);
      cellID = nextCellID;
    }
    if(!cell) {
      break;
    }
  }

  if (
    (getDirection() === "horizontal" && row !== cellRow) ||
    (getDirection() === "vertical" && column !== cellColumn) ||
    (visitedCells.length !== getBoatLength())
  ) {
    visitedCells.forEach((cell) => {
      cell.style.backgroundColor = "red";
    });
  }
};

const handleMouseLeave = (event) => {
  document.querySelectorAll(".board-cell").forEach((cell) => {
    if(!cell.classList.contains("placed-ship")) {
      cell.style.backgroundColor = "";
    }
  });
};

function placeShip(event, player) {
  const cellCoordinates = event.target.innerHTML;
  player.placeShip(getBoatLength(), cellCoordinates, getDirection());
}

function createBoardGrid(player) {
  const boardSize = player.gameboard.size;
  const parentDiv = document.createElement("div");
  parentDiv.id = player.playerID;

  parentDiv.style.setProperty("--n", boardSize);

  const main = document.querySelector("main");
  main.prepend(parentDiv);

  let coordinates = [0, 0];
  let cellID = 1;

  for (let i = 1; i <= boardSize; i++) {
    for (let j = 1; j <= boardSize; j++) {
      coordinates[0] = i;
      coordinates[1] = j;
      const div = document.createElement("div");
      div.classList.add("board-cell");
      div.textContent = coordinates.join(",");
      div.id = String(cellID);
      div.addEventListener("mouseenter", changeCellColour);
      div.addEventListener("mouseleave", handleMouseLeave);
      div.addEventListener("click", (event) => {
        placeShip(event, getCurrentPlayer());
        changeCellColour(event);
      })
      parentDiv.appendChild(div);
      cellID++;
    }
  }
}

// function placeComputerShips() {
//   const cells = document.querySelectorAll(".board-cell");

//   player2.gameboard.occupied.keys().forEach((key) => {
//     const target = [...cells].find((cell) => cell.textContent.trim() === key);

//     target.style.setProperty("background-color", "blue");
//   });
// }

function updateTurnHeader() {
  let turnHeader = document.querySelector(".player-turn-header");
  if (playerTurn === 0) {
    turnHeader.textContent = "Player Turn: Player 1";
  } else {
    turnHeader.textContent = "Player Turn: Player 2";
  }
}

function toggleInactiveClass(firstPlayer, secondPlayer) {
  firstPlayer.classList.toggle("inactive");
  secondPlayer.classList.toggle("inactive");
}

function changePlayedCell(cell, hitResult) {
  cell.classList.toggle("inactive");
  if (hitResult === "missed") {
    cell.style.setProperty("background-color", "grey");
  } else {
    cell.style.setProperty("background-color", "green");
  }
}

function updateDOM(cell, player1Board, player2Board) {
  changePlayedCell(cell, moveStatus);
  if (gameOver) {
    const modal = document.querySelector(".modal-box");
    modal.style.setProperty("visibility", "visible");

    const winnerHeader = document.querySelector(".winning-player");
    winnerHeader.innerHTML = winner;

    document.querySelector("main").style.setProperty("pointer-event", "none");
  } else {
    updateTurnHeader();
    toggleInactiveClass(player1Board, player2Board);
  }
}

function displayBoats() {
  const boats = document.querySelector(".boats");
  boats.style.setProperty("display", "grid");

  document.querySelectorAll(".boat").forEach(el =>
    el.addEventListener("click", (event) => {
      //remove selected-boat class from all boats
      for (const child of boats.children) {
        child.classList.remove("selected-boat");
      }
      //add selected-boat class for special highlighting
      const boat = event.currentTarget;
      boat.classList.toggle("selected-boat");
      //obtain and return the length of the boat to game controller
      const boatLength = boat.children.length;
      setBoatLength(boatLength);
    })
  );

  const directionSelector = document.querySelector(".direction-selector");
  directionSelector.style.setProperty("display", "flex");
  directionSelector.addEventListener("click", (event) => {
    const input = event.target.closest("input");
    if (input) {
      setDirection(input.value);
    }
  });
}

function displayPlayerSelection(player) {
  createBoardGrid(player);
  displayBoats();
}

export function initUI() {
  // createBoardGrid(player2);

  // const player1Board = document.querySelector("#player1");
  // const player2Board = document.querySelector("#player2");

  // // player1Board.classList.toggle("inactive");
  // placeShips();

  // //event listeners
  // document.querySelector("#player1").addEventListener("click", (event) => {
  //   const cell = event.target.closest(".board-cell");
  //   const cellCoordinates = event.target.innerHTML;
  //   if (!cell) {
  //     return;
  //   }
  //   playTurn(cellCoordinates);
  //   updateDOM(cell, player1Board, player2Board);
  // });

  // document.querySelector("#player2").addEventListener("click", (event) => {
  //   const cell = event.target.closest(".board-cell");
  //   const cellCoordinates = event.target.innerHTML;
  //   if (!cell) {
  //     return;
  //   }
  //   playTurn(cellCoordinates);
  //   updateDOM(cell, player1Board, player2Board);
  // });

  document
    .querySelector(".opponent-buttons")
    .addEventListener("click", (event) => {
      const button = event.target.closest("button");

      if (button) {
        setOpponentType(button.value);
      }
      document
        .querySelector(".game-start")
        .style.setProperty("display", "none");
      displayPlayerSelection(player1);
    });
}
