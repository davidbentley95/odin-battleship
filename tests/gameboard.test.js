const { Gameboard } = require("../src/models/gameboard");
const { Ship } = require("../src/models/ship");

let gameboard;

beforeEach(() => {
  gameboard = new Gameboard();
});

test("Place ship: Valid (vertical)", () => {
  const ship = new Ship(5);

  const expected = new Map([
    ["1,1", ship],
    ["2,1", ship],
    ["3,1", ship],
    ["4,1", ship],
    ["5,1", ship],
  ]);

  expect(gameboard.placeShip(ship, "1,1", "vertical")).toEqual(expected);
});

test("Receive Attack Hits Ship (returns 'hit')", () => {
  const ship = new Ship(5);
  gameboard.placeShip(ship, "1,1", "vertical");

  expect(gameboard.receiveAttack("2,1")).toBe("hit");
  expect(ship.hits).toBe(1);
});

test("Receive Attack increments hits correctly", () => {
  const ship = new Ship(5);
  ship.hits = 2;

  gameboard.placeShip(ship, "1,1", "vertical");

  expect(gameboard.receiveAttack("2,1")).toBe("hit");
  expect(ship.hits).toBe(3);
});

test("Sinking a ship (returns 'sunk' on final hit)", () => {
  const ship = new Ship(5);
  gameboard.placeShip(ship, "1,1", "vertical");

  gameboard.receiveAttack("1,1");
  gameboard.receiveAttack("2,1");
  gameboard.receiveAttack("3,1");
  gameboard.receiveAttack("4,1");

  expect(gameboard.receiveAttack("5,1")).toBe("sunk");
  expect(ship.isSunk()).toBe(true);
});

test("Receive Attack Misses Ship (returns 'missed' and stores coord)", () => {
  const ship = new Ship(5);
  gameboard.placeShip(ship, "1,1", "vertical");

  expect(gameboard.receiveAttack("1,2")).toBe("missed");
  expect(gameboard.missedShots.has("1,2")).toBe(true);
});

test("Unable to replay a missed move", () => {
  const ship = new Ship(5);
  gameboard.placeShip(ship, "1,1", "vertical");

  gameboard.receiveAttack("1,2");
  expect(gameboard.receiveAttack("1,2")).toBe(
    "These coordinates were already played"
  );
});

test("Unable to replay a successful move", () => {
  const ship = new Ship(5);
  gameboard.placeShip(ship, "1,1", "vertical");

  gameboard.receiveAttack("1,1");
  expect(gameboard.receiveAttack("1,1")).toBe(
    "These coordinates were already played"
  );
});

test("Sinking a ship after misses and duplicates", () => {
  const ship = new Ship(5);
  gameboard.placeShip(ship, "1,1", "vertical");

  gameboard.receiveAttack("1,1");
  gameboard.receiveAttack("2,1");

  // duplicate (should not change hits)
  expect(gameboard.receiveAttack("2,1")).toBe(
    "These coordinates were already played"
  );

  gameboard.receiveAttack("2,2"); // miss
  gameboard.receiveAttack("2,3"); // miss
  gameboard.receiveAttack("3,1");
  gameboard.receiveAttack("4,1");

  expect(gameboard.receiveAttack("5,1")).toBe("sunk");
  expect(ship.isSunk()).toBe(true);
});

test("Gameover returns true when all placed ships are sunk", () => {
  const ship = new Ship(2);
  gameboard.placeShip(ship, "1,1", "vertical");

  expect(gameboard.gameOver()).toBe(false);

  gameboard.receiveAttack("1,1");
  expect(gameboard.gameOver()).toBe(false);

  gameboard.receiveAttack("2,1"); // sinks it
  expect(gameboard.gameOver()).toBe(true);
});

