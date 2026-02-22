const { Gameboard } = require("../src/gameboard");
const { Ship } = require("../src/ship");

const gameboard = new Gameboard();

test("Place ship: Valid", () => {
  const ship = new Ship(5);
  const expected = new Map([
    ["1,1", ship],
    ["2,1", ship],
    ["3,1", ship],
    ["4,1", ship],
    ["5,1", ship],
  ]);

  expect(gameboard.placeShip(ship, "1,1")).toEqual(expected);
});

test("Receive Attack Hits Ship with 0 damage", () => {
    const ship = new Ship(5);
    gameboard.placeShip(ship, "1,1");
    expect(gameboard.receiveAttack("2,1")).toEqual(1);
})

test("Receive Attack Hits Ship with 2 damage", () => {
    const ship = new Ship(5);
    ship.hits = 2;
    gameboard.placeShip(ship, "1,1");
    expect(gameboard.receiveAttack("2,1")).toEqual(3);
})

test("Sinking a ship", () => {
    const ship = new Ship(5);
    ship.hits = 4;
    gameboard.placeShip(ship, "1,1");
    expect(gameboard.receiveAttack("2,1")).toEqual(true);
})

test("Receive Attack Misses Ship", () => {
    const ship = new Ship(5);
    gameboard.placeShip(ship, "1,1");
    expect(gameboard.receiveAttack("1,2")).toContain("1,2");
})

