const { COLORS } = require('./colors.js');
const { BIT_PATTERNS } = require('../utils/bitFns.js');

function Tile (buffer) {
  if (buffer && buffer.length === 16) {
    this.data = new Uint8Array(buffer);
  } else {
    this.data = new Uint8Array(16);
  }
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
    // draw tile data as a 8x8 image
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const lowBit = (this.data[row] & BIT_PATTERNS[col]) === 0 ? '0' : '1';
        const highBit = (this.data[row + 8] & BIT_PATTERNS[col]) === 0 ? '0' : '1';
        const paletteValue = parseInt((highBit + lowBit), 2);
        const pixelColor = palette.colors[paletteValue];
        const displayColor = COLORS[pixelColor];

        const startX = x + col;
        const startY = y + row;
        ctx.fillStyle = displayColor;
        ctx.fillRect(startX, startY, 1, 1);
      }
    }
  }
};

exports.Tile = Tile;
