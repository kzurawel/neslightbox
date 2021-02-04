// these patterns are high-to-low, not low-to-high
const BIT_PATTERNS = {
  0: '0b10000000',
  1: '0b01000000',
  2: '0b00100000',
  3: '0b00010000',
  4: '0b00001000',
  5: '0b00000100',
  6: '0b00000010',
  7: '0b00000001',
  '0Off': '0b01111111',
  '1Off': '0b10111111',
  '2Off': '0b11011111',
  '3Off': '0b11101111',
  '4Off': '0b11110111',
  '5Off': '0b11111011',
  '6Off': '0b11111101',
  '7Off': '0b11111110'
};
exports.BIT_PATTERNS = BIT_PATTERNS;

// Turn given bit of a byte on (1)
function on (byte, bit) {
  return byte | BIT_PATTERNS[bit];
}
exports.on = on;

// Turn given bit of a byte off (0)
function off (byte, bit) {
  return byte & BIT_PATTERNS[`${bit}Off`];
}
exports.off = off;

function get (byte, bit) {
  let result;
  if ((byte & BIT_PATTERNS[bit]) === 0) {
    result = 0;
  } else {
    result = 1;
  }
  return result;
}
exports.get = get;

// Swap given bit of a byte to its opposite
function toggle (byte, bit) {
  if (byte & BIT_PATTERNS[bit] > 0) {
    // on, turn off
    return off(byte, bit);
  } else {
    // off, turn on
    return on(byte, bit);
  }
}
exports.toggle = toggle;
