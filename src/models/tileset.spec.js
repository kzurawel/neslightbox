/* global test, expect */
const { Tileset } = require('./tileset.js');

test('constructor with no args', () => {
  const t = new Tileset();

  expect(t.rawData.length).toBe(8192);
  expect(t.tiles.length).toBe(0);
  expect(t.is8x16).toBe(false);
  expect(t.filename).toBe('');
});

test('load with valid data', () => {
  const t = new Tileset();
  const b = Buffer.alloc(8192, 23);

  t.load(b);

  expect(t.rawData.length).toBe(8192);
  expect(t.rawData[0]).toBe(23);
  expect(t.rawData[8191]).toBe(23);
  expect(t.tiles.length).toBe(512);
});

test('load with invalid data', () => {
  const t = new Tileset();
  const b = Buffer.alloc(54);

  expect(() => { t.load(b); }).toThrow('Unsupported CHR size: 54');
});
