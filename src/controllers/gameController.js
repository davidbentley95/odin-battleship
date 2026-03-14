import Player from "../models/player.js"

export const player1 = new Player("player1");
export const player2 = new Player("player2");
export let playerTurn = 0;
export let gameOver = false;
export let moveStatus = "";
export let winner = "";
export let opponentType = "";
let boatLength = 5;
let boatDirection = "horizontal";

// player1.presetShipPlacement();
// player2.presetShipPlacement();

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

 export function setOpponentType(type) {
    opponentType = type;
    console.log(opponentType);
 }

 function addShip(player, shipLength, coordinates, direction) {
    player.addShip(shipLength, coordinates, direction);
 }

 export function setBoatLength(length) {
    boatLength = length;
 }

 export function getBoatLength() {
    return boatLength;
 }

 export function setDirection(direction) {
    boatDirection = direction;
 }

 export function getDirection() {
    return boatDirection;
 }

function checkGameOver() {
    if(player1.gameboard.gameOver() === true) {
        winner = player2.playerID;
        player2.score++;
        gameOver = true;
    }

    if(player2.gameboard.gameOver() === true) {
        winner = player1.playerID;
        player1.score++;
        gameOver = true;
    }
 };

