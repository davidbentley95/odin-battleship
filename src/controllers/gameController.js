import Player from "../models/player.js"

export const player1 = new Player("player1");
export const player2 = new Player("player2");
export let playerTurn = 0;
export let gameOver = false;
export let moveStatus = "";
export let winner = ""; 

player1.presetShipPlacement();
player2.presetShipPlacement();

export function playTurn(cellCoordinates) {

    if(playerTurn === 0) {
        moveStatus = player2.gameboard.receiveAttack(cellCoordinates);
        checkGameOver();
        playerTurn = 1;
    } else {
        moveStatus = player1.gameboard.receiveAttack(cellCoordinates);
        checkGameOver();
        playerTurn = 0;
    }

 };

function checkGameOver() {
    if(player1.gameboard.gameOver() === true) {
        winner = player2.playerID;
        return "Player 2 wins!"
    }

    if(player2.gameboard.gameOver() === true) {
        winner = player1.playerID;
        return "Player 1 wins!"
    }
 };

