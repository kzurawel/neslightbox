/* global test, expect */
const { Tile } = require('./tile.js');

test('constructor with no args', () => {
  const t = new Tile();

  expect(t.data.length).toBe(16);
});

test('constructor with args', () => {
  const b = new Uint8Array(16);
  b[1] = 0xff;
  b[2] = 0xcc;
  const t = new Tile(b);

  expect(t.data[0]).toBe(0);
  expect(t.data[1]).toBe(0xff);
  expect(t.data[2]).toBe(0xcc);
});
