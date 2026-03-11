import Player from "../models/player.js"

export const player1 = new Player("player1");
export const player2 = new Player("player2");
export let playerTurn = 0;
export let gameOver = false; 

export function getPlayerTurn() {
    return playerTurn;
}

export function setPlayerTurn(turn) {
    playerTurn = turn;
}

player1.presetShipPlacement();
player2.presetShipPlacement();

export function playTurn(cellCoordinates) {

    if(playerTurn === 0) {
        return player2.gameboard.receiveAttack(cellCoordinates);
    } else {
        return player1.gameboard.receiveAttack(cellCoordinates);
    }

 }

