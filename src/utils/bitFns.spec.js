/* global test, describe, expect */
const bits = require('./bitFns.js');

describe('on', () => {
  test('can turn on bits from zero', () => {
    // 0b00000000 should become 0b00000001
    expect(bits.on(0, 7)).toBe(1);
    // 0b00000000 should become 0b10000000
    expect(bits.on(0, 0)).toBe(128);
  });

  test('can turn on bits from 128', () => {
    // 0b10000000 should become 0b10000001
    expect(bits.on(128, 7)).toBe(129);
    // 0b10000000 should become 0b11000000
    expect(bits.on(128, 1)).toBe(192);
  });

  test('does not modify already-on bits', () => {
    expect(bits.on(1, 7)).toBe(1);
    expect(bits.on(128, 0)).toBe(128);
  });
});
