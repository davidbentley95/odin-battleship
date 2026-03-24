import {
  player1,
  player2,
  playerTurn,
  playTurn,
  playComputerTurn,
  moveStatus,
  gameOver,
  winner,
  setOpponentType,
  getOpponentType,
  setBoatLength,
  getBoatLength,
  setDirection,
  getDirection,
  setPlayerTurn,
  setPlacingShips,
  getPlacingShips,
  opponentType,
  playAgain
} from "../controllers/gameController.js";

const turnHeader = document.querySelector(".player-turn-header");
const submitButton = document.querySelector(".submit");
const playGameButton = document.querySelector(".play-game");
const opponentButtons = document.querySelector(".opponent-buttons");
const modal = document.querySelector(".modal-box");
const playAgainButton = document.querySelector(".play-again");
const startOverButton = document.querySelector(".start-over");
const boats = document.querySelector(".boats");
const directionSelector = document.querySelector(".direction-selector");
const player1Container = document.querySelector(".player1");
const player2Container = document.querySelector(".player2");

// event helpers
const changeCellColour = (event) => {
  let cell = event.target;
  let cellID = cell.id;
  let row = Number(cell.innerHTML.split(",")[0]);
  let column = Number(cell.innerHTML.split(",")[1]);
  let cellRow = 0;
  let cellColumn = 0;
  let visitedCells = [];

  for (let i = 1; i <= getBoatLength(); i++) {
    cell.classList.toggle("placing-ship");
    visitedCells.push(cell);
    cellRow = Number(cell.innerHTML.split(",")[0]);
    cellColumn = Number(cell.innerHTML.split(",")[1]);

    if (event.type === "click") {
      cell.classList.toggle("placing-ship");
      cell.classList.add("placed-ship");
    }

    if (getDirection() === "horizontal") {
      cell = cell.nextElementSibling;
    } else {
      let nextCellID = String(Number(cellID) + 10);
      cell = document.getElementById(nextCellID);
      cellID = nextCellID;
    }

    if (!cell) {
      break;
    }
  }

  if (
    (getDirection() === "horizontal" && row !== cellRow) ||
    (getDirection() === "vertical" && column !== cellColumn) ||
    visitedCells.length !== getBoatLength()
  ) {
    visitedCells.forEach((cell) => {
      cell.classList.toggle("invalid-placement");
    });
  }
};

const clearCellColour = () => {
  document.querySelectorAll(".board-cell").forEach((cell) => {
    cell.classList.remove("invalid-placement");
    if (!cell.classList.contains("placed-ship")) {
      cell.classList.remove("placing-ship");
    }
  });
};

function placeShip(event, player) {
  const cellCoordinates = event.target.innerHTML;

  if (player.fleet.length < 5) {
    player.placeShip(getBoatLength(), cellCoordinates, getDirection());
    changeCellColour(event);
    changeSelectedShip();
  }
}

function changeSelectedShip() {
  let currentShip = document.querySelector(".selected-boat");
  if (!currentShip) return;

  let nextBoat = currentShip.nextElementSibling;
  currentShip.classList.remove("selected-boat");
  currentShip.classList.add("inactive");

  if (nextBoat) {
    nextBoat.classList.add("selected-boat");
    let nextBoatLength = nextBoat.children.length;
    setBoatLength(nextBoatLength);
  }
}

function createBoardGrid(player) {
  const boardSize = player.gameboard.size;
  const parentDiv = document.createElement("div");
  parentDiv.id = player.playerID;
  parentDiv.classList.add("player-board");

  document.querySelector(`.${player.playerID}`).classList.remove("inactive");

  parentDiv.style.setProperty("--n", boardSize);

  const boardContainer = document.querySelector(`.${player.playerID}`);
  boardContainer.append(parentDiv);

  let coordinates = [0, 0];
  let cellID = player.playerID === "player1" ? 1 : 101;

  for (let i = 1; i <= boardSize; i++) {
    for (let j = 1; j <= boardSize; j++) {
      coordinates[0] = i;
      coordinates[1] = j;

      const div = document.createElement("div");
      div.classList.add("board-cell");

      let coordinateString = coordinates.join(",");
      div.textContent = coordinateString;
      div.dataset.coord = coordinateString;
      div.id = String(cellID);

      div.addEventListener("mouseenter", changeCellColour);
      div.addEventListener("mouseleave", clearCellColour);
      div.addEventListener("click", (event) => {
        if (getPlacingShips()) {
          placeShip(event, player);
        }
      });

      parentDiv.appendChild(div);
      cellID++;
    }
  }
}

function updateTurnHeader() {
  if (playerTurn === 0) {
    turnHeader.textContent = "Player Turn: Player 1";
  } else {
    turnHeader.textContent = "Player Turn: Player 2";
  }
}

function updatePlayerScores() {
  const player1Score = document.querySelector(".player1-score");
  const player2Score = document.querySelector(".player2-score");

  player1Score.innerHTML = player1.score;
  player2Score.innerHTML = player2.score;
}

function toggleInactiveClass(firstPlayer, secondPlayer) {
  firstPlayer.classList.toggle("inactive");
  secondPlayer.classList.toggle("inactive");
}

function changePlayedCell(cell, hitResult) {
  cell.classList.add("inactive");

  if (hitResult === "missed") {
    cell.classList.add("missed");
  } else {
    cell.classList.add("hit");
  }
}

function updateDOM(cell, playerBoards) {
  changePlayedCell(cell, moveStatus);

  if (gameOver) {
    modal.style.display = "flex";

    const winnerHeader = document.querySelector(".winning-player");
    winnerHeader.innerHTML = winner;

    updatePlayerScores();

    document.querySelector("main").classList.add("inactive");
  } else {
    updateTurnHeader();
    toggleInactiveClass(playerBoards[0], playerBoards[1]);
  }
}

function displayBoats() {
  const boatControls = document.querySelector(".place-boats-controls");
  boatControls.style.display = "flex";
  boats.style.display = "grid";

  directionSelector.style.display = "flex";

  const allBoats = document.querySelectorAll(".boat");
  allBoats.forEach((boat) => {
    boat.classList.remove("inactive");
    boat.classList.remove("selected-boat");
  });

  if (allBoats[0]) {
    allBoats[0].classList.add("selected-boat");
    setBoatLength(allBoats[0].children.length);
  }

  setDirection("horizontal");
}

function displaySubmitButton() {
  submitButton.style.display = "flex";
}

function displayPlayGameButton() {
  playGameButton.style.display = "flex";
}

function displayPlayerSelection(player) {
  const playerID = player.playerID;
  createBoardGrid(player);
  document.querySelector(`.${playerID}-header`).style.display = "flex";
  displayBoats();

  if (player.playerID === "player1") {
    displaySubmitButton();
  } else {
    displayPlayGameButton();
  }
}

function playComputerMove(playerBoards) {
  let cellCoordinates = playComputerTurn();
  let cell = document.querySelector(`#player1 [data-coord="${cellCoordinates}"]`);
  updateDOM(cell, playerBoards);
}

function renderPlayGame() {
  const playerBoards = document.querySelectorAll(".board-container");

  playerBoards.forEach((board) => {
    board.style.display = "grid";
  });

  // set player1 board inactive to start so player2 goes first click target
  player1Container.classList.add("inactive");
  player2Container.classList.remove("inactive");

  const cells = document.querySelectorAll(".board-cell");
  cells.forEach((cell) => {
    cell.removeEventListener("mouseenter", changeCellColour);
    cell.removeEventListener("mouseleave", clearCellColour);
    cell.classList.add("playing-game-cell");
  });

  document.querySelector(".place-boats-controls").style.display = "none";
  turnHeader.style.display = "flex";
  updateTurnHeader();
}

function resetUIForPlayAgain() {
  const board1 = document.querySelector("#player1");
  const board2 = document.querySelector("#player2");

  if (board1) board1.remove();
  if (board2) board2.remove();

  modal.style.display = "none";
  document.querySelector("main").classList.remove("inactive");

  submitButton.style.display = "none";
  playGameButton.style.display = "none";
  turnHeader.style.display = "none";

  document.querySelector(".place-boats-controls").style.display = "none";
  boats.style.display = "none";
  directionSelector.style.display = "none";

  document.querySelector(".player1-header").style.display = "none";
  document.querySelector(".player2-header").style.display = "none";

  player1Container.classList.remove("inactive");
  player2Container.classList.remove("inactive");

  document.querySelector(".player2-name").innerHTML = "Player 2";

  const allBoats = document.querySelectorAll(".boat");
  allBoats.forEach((boat) => {
    boat.classList.remove("selected-boat");
    boat.classList.remove("inactive");
  });

  if (allBoats[0]) {
    allBoats[0].classList.add("selected-boat");
    setBoatLength(allBoats[0].children.length);
  }

  setDirection("horizontal");
}

function handlePlayer1BoardClick(event) {
  if (getPlacingShips()) return;

  const playerBoards = document.querySelectorAll(".board-container");
  const cell = event.target.closest(".board-cell");
  if (!cell) return;

  const cellCoordinates = cell.innerHTML;
  playTurn(cellCoordinates);
  updateDOM(cell, playerBoards);
}

function handlePlayer2BoardClick(event) {
  if (getPlacingShips()) return;

  const playerBoards = document.querySelectorAll(".board-container");
  const cell = event.target.closest(".board-cell");
  if (!cell) return;

  const cellCoordinates = cell.innerHTML;
  playTurn(cellCoordinates);
  updateDOM(cell, playerBoards);

  if (opponentType === "computer" && !gameOver) {
    playComputerMove(playerBoards);
  }
}

export function initUI() {
  opponentButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    setOpponentType(button.value);
    document.querySelector(".game-start").style.display = "none";
    displayPlayerSelection(player1);
  });

  boats.addEventListener("click", (event) => {
    const boat = event.target.closest(".boat");
    if (!boat) return;

    for (const child of boats.children) {
      child.classList.remove("selected-boat");
    }

    boat.classList.add("selected-boat");
    const boatLength = boat.children.length;
    setBoatLength(boatLength);
  });

  directionSelector.addEventListener("click", (event) => {
    const input = event.target.closest("input");
    if (input) {
      setDirection(input.value);
    }
  });

  player1Container.addEventListener("click", handlePlayer1BoardClick);
  player2Container.addEventListener("click", handlePlayer2BoardClick);

  submitButton.addEventListener("click", () => {
    if (player1.fleet.length === 5 && getOpponentType() === "player") {
      setPlayerTurn(1);

      displayPlayerSelection(player2);

      const boats = document.querySelectorAll(".boat");
      if (boats[0]) {
        boats[0].classList.add("selected-boat");
      }

      boats.forEach((boat) => {
        boat.classList.remove("inactive");
      });

      document.querySelector(".board-container").style.display = "none";
      displayPlayGameButton();
    } else if (player1.fleet.length === 5 && getOpponentType() === "computer") {
      createBoardGrid(player2);
      const player2Header = document.querySelector(".player2-header");
      player2Header.style.display = "flex";
      document.querySelector(".player2-name").innerHTML = "Computer";
      player2.randomShipPlacement();
      renderPlayGame();
      playGameButton.style.display = "none";
      setPlacingShips(false);
    } else {
      alert("You must place all your ships before submitting");
    }

    submitButton.style.display = "none";
  });

  playGameButton.addEventListener("click", () => {
    renderPlayGame();
    playGameButton.style.display = "none";
    setPlacingShips(false);
  });

  playAgainButton.addEventListener("click", () => {
    playAgain();
    resetUIForPlayAgain();
    setPlacingShips(true);
    setPlayerTurn(0);
    displayPlayerSelection(player1);
  });

  startOverButton.addEventListener("click", () => {
    window.location.reload();
  });
}
