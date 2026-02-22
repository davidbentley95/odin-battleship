const {Gameboard} = require('../src/gameboard');
const {Ship} = require('../src/ship');

const gameboard = new Gameboard();
const ship = new Ship(5);

test("Place ship", () => {
  const expected = new Map([
    ["1,1", ship],
    ["2,1", ship],
    ["3,1", ship],
    ["4,1", ship],
    ["5,1", ship],
  ]);

  expect(gameboard.placeShip(ship, [1,1])).toEqual(expected);
});