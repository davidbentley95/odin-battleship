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
} from "../controllers/gameController.js";

const turnHeader = document.querySelector(".player-turn-header");
const submitButton = document.querySelector(".submit");
const playGameButton = document.querySelector(".play-game");
const opponentButtons = document.querySelector(".opponent-buttons");

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
  if(player.fleet.length < 5) {
    player.placeShip(getBoatLength(), cellCoordinates, getDirection());
    changeCellColour(event);
    changeSelectedShip();
  }
  
}

function changeSelectedShip() {
  let currentShip = document.querySelector(".selected-boat");
  let nextBoat = currentShip.nextElementSibling;
  currentShip.classList.toggle("selected-boat");
  currentShip.classList.toggle("inactive");

  if (nextBoat) {
    nextBoat.classList.toggle("selected-boat");
    let nextBoatLength = nextBoat.children.length;
    setBoatLength(nextBoatLength);
  }
}

function createBoardGrid(player) {
  const boardSize = player.gameboard.size;
  const parentDiv = document.createElement("div");
  parentDiv.id = player.playerID;
  parentDiv.classList.add("player-board");

  parentDiv.style.setProperty("--n", boardSize);

  const main = document.querySelector("main");
  main.append(parentDiv);

  let coordinates = [0, 0];
  let cellID;

  if(player.playerID === "player1") {
    cellID = 1;
  } else {
    cellID = 101;
  }

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

// function placeComputerShips() {
//   const cells = document.querySelectorAll(".board-cell");

//   player2.gameboard.occupied.keys().forEach((key) => {
//     const target = [...cells].find((cell) => cell.textContent.trim() === key);

//     target.style.setProperty("background-color", "blue");
//   });
// }

function updateTurnHeader() {

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
    cell.classList.add("missed");
  } else {
    cell.classList.add("hit");
  }
}

function updateDOM(cell, player1Board, player2Board) {
  changePlayedCell(cell, moveStatus);
  if (gameOver) {
    const modal = document.querySelector(".modal-box");
    modal.style.setProperty("visibility", "visible");

    const winnerHeader = document.querySelector(".winning-player");
    winnerHeader.innerHTML = winner;

    document.querySelector("main").classList.add("inactive");
  } else {
    updateTurnHeader();
    toggleInactiveClass(player1Board, player2Board);
  }
}

function displayBoats() {
  const boats = document.querySelector(".boats");
  boats.style.setProperty("display", "grid");

  //controls for when boats are selected
  document.querySelectorAll(".boat").forEach((el) =>
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
    }),
  );

  const directionSelector = document.querySelector(".direction-selector");
  directionSelector.style.setProperty("display", "flex");
  directionSelector.addEventListener("click", (event) => {
    const input = event.target.closest("input");
    if (input) {
      setDirection(input.value);
    }
  });

  setBoatLength(5);
}

function displaySubmitButton(player) {
  submitButton.style.setProperty("display", "flex");
}

function displayPlayGameButton() {
  playGameButton.style.setProperty("display", "flex");
}

function displayPlayerSelection(player) {
  createBoardGrid(player);
  displayBoats();
  if (player.playerID === "player1") {
    displaySubmitButton(player);
  } else {
    displayPlayGameButton();
  }
}

function playComputerMove(playerBoards) {
  let cellCoordinates = playComputerTurn();

  let cell = document.querySelector(`#player1 [data-coord="${cellCoordinates}"]`);

  updateDOM(cell, playerBoards[0], playerBoards[1]);
}

function renderPlayGame() {
  const player1Board = document.querySelector("#player1");
  const player2Board = document.querySelector("#player2");
  
  //display both boards
  const playerBoards = document.querySelectorAll(".player-board");
  playerBoards.forEach((board) => {
    board.style.setProperty("display", "grid");
  });

  //set player1 to inactive to start
  player1Board.classList.toggle("inactive");

  player1Board.addEventListener("click", (event) => {
      const cell = event.target.closest(".board-cell");
      const cellCoordinates = event.target.innerHTML;
      if (!cell) {
        return;
      }
      playTurn(cellCoordinates);
      updateDOM(cell, playerBoards[0], playerBoards[1]);
    });

    player2Board.addEventListener("click", (event) => {
      const cell = event.target.closest(".board-cell");
      const cellCoordinates = event.target.innerHTML;
      if (!cell) {
        return;
      }
      playTurn(cellCoordinates);
      updateDOM(cell, playerBoards[0], playerBoards[1]);
      if(opponentType === "computer") {
        playComputerMove(playerBoards);
      }
    });

  //remove ship placing formatting
  const cells = document.querySelectorAll(".board-cell");

  cells.forEach((cell) => {
    cell.removeEventListener("mouseenter", changeCellColour);
    cell.removeEventListener("mouseleave", clearCellColour);
    cell.classList.add("playing-game-cell");
  });

  //hide boats and radio buttons
  document.querySelector(".place-boats-controls").style.setProperty("display", "none");

  //show player turn header
  turnHeader.style.setProperty("display", "flex");
}

export function initUI() {

  opponentButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (button) {
      setOpponentType(button.value);
    }
    document.querySelector(".game-start").style.setProperty("display", "none");
    displayPlayerSelection(player1);
  });

  submitButton.addEventListener("click", () => {
    if (player1.fleet.length === 5 && getOpponentType() === "player") {
      //change current turn
      setPlayerTurn(1);

      displayPlayerSelection(player2);
      const boats = document.querySelectorAll(".boat");
      boats[0].classList.toggle("selected-boat");
      boats.forEach((boat) => {
        boat.classList.toggle("inactive");
      });

      //hide player1 board
      document.querySelector("#player1").style.setProperty("display", "none");

      //display play game button
      displayPlayGameButton();
    } else if(player1.fleet.length === 5 && getOpponentType() === "computer") {
      createBoardGrid(player2);
      player2.randomShipPlacement();
      renderPlayGame();
      playGameButton.style.setProperty("display", "none");
      setPlacingShips(false);
    } else {
      alert("You must place all your ships before submitting");
    }
    //hide submit button after pressing
      submitButton.style.setProperty("display", "none");
  });

  playGameButton.addEventListener("click", () => {
    renderPlayGame();
    playGameButton.style.setProperty("display", "none");
    setPlacingShips(false);
    
  });
}
