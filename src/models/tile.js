const { COLORS } = require('./colors.js');

// these patterns are high-to-low, not low-to-high
const BIT_PATTERNS = {
  0: '0b10000000',
  1: '0b01000000',
  2: '0b00100000',
  3: '0b00010000',
  4: '0b00001000',
  5: '0b00000100',
  6: '0b00000010',
  7: '0b00000001'
};

function Tile (buffer) {
  if (buffer && buffer.length === 16) {
    this.data = new Uint8Array(buffer);
  } else {
    this.data = new Uint8Array(16);
  }
  this.selected = false;
  this.editable = true;
}

Tile.prototype = {
  flipVertical: function () {
    for (let i = 0; i < 4; ++i) {
      let t = this.data[i];
      this.data[i] = this.data[7 - i];
      this.data[7 - i] = t;
      t = this.data[i + 8];
      this.data[i + 8] = this.data[(7 - i) + 8];
      this.data[(7 - i) + 8] = t;
    }
  },
  flipHorizontal: function () {
    for (let i = 0; i < 16; ++i) {
      let d = this.data[i];
      d = (d & 0xf0) >> 4 | (d & 0x0f) << 4;
      d = (d & 0xcc) >> 2 | (d & 0x33) << 2;
      d = (d & 0xaa) >> 1 | (d & 0x55) << 1;
      this.data[i] = d;
    }
  },
  draw: function (ctx, x, y, palette) {
    // draw tile data as a 16x16 image
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const lowBit = (this.data[row] & BIT_PATTERNS[col]) === 0 ? '0' : '1';
        const highBit = (this.data[row + 8] & BIT_PATTERNS[col]) === 0 ? '0' : '1';
        const paletteValue = parseInt((highBit + lowBit), 2);
        const pixelColor = palette.colors[paletteValue];
        const displayColor = COLORS[pixelColor];

        const startX = x + (col * 2);
        const startY = y + (row * 2);
        ctx.fillStyle = displayColor;
        ctx.fillRect(startX, startY, 2, 2);
      }
    }
  }
};

exports.Tile = Tile;
