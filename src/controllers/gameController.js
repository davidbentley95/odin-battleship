import Player from "../models/player.js"

export const player1 = new Player("player1");
export const player2 = new Player("player2");
export let playerTurn = 0;

export function getPlayerTurn() {
    return playerTurn;
}

export function setPlayerTurn(turn) {
    playerTurn = turn;
}

player1.presetShipPlacement();
player2.presetShipPlacement();

export function playTurn(cellCoordinates) {

    

 }

