const { ipcRenderer } = require('electron');
const { COLORS } = require('./colors.js');
const bit = require('../utils/bitFns.js');
const fs = require('fs');

function Nametable () {
  this.data = new Uint8Array(960);
  this.attrs = new Uint8Array(64);
  this.filepath = '';
  this.filename = '';
}

Nametable.prototype = {
  load: function (buffer, filepath, filename) {
    if (buffer.length === 1024 || buffer.length === 960) {
      this.filepath = filepath;
      this.filename = filename;
      for (let i = 0; i < 960; i++) {
        this.data[i] = buffer[i];
      }

      if (buffer.length === 1024) {
        for (let i = 960, j = 0; i < 1024; i++, j++) {
          this.attrs[j] = buffer[i];
        }
      }

      ipcRenderer.send('ALLOW_NAMETABLE_SAVE', true);
    } else {
      throw new Error(`Unsupported nametable size: ${buffer.length}`);
    }
  },

  save: function (filepath) {
    const buffer = Buffer.alloc(1024);
    for (let i = 0; i < 960; i++) {
      buffer[i] = this.data[i];
    }

    for (let i = 960, j = 0; i < 1024; i++, j++) {
      buffer[i] = this.attrs[j];
    }

    fs.writeFile(filepath, buffer, (err) => {
      if (err) { console.error(err); }
    });
  },

  draw: function (ctx, tileset, palettes) {
    ctx.fillStyle = COLORS[palettes[0].colors[0]];
    ctx.fillRect(0, 0, 256, 240);
    for (let i = 0; i < 960; i++) {
      const tile = tileset.bank === 0 ? this.data[i] : this.data[i] + 256;
      let x, y;
      if (i < 32) {
        x = i;
        y = 0;
      } else {
        x = i % 32;
        y = (i - x) / 32;
      }

      const attrByte = getAttrByte(x, y);
      const attrQuadrant = getAttrByteQuadrant(x, y);
      const paletteIndex = getAttrPalette(this.attrs[attrByte], attrQuadrant);

      x = x * 8;
      y = y * 8;

      tileset.tiles[tile].draw(ctx, x, y, palettes[paletteIndex]);
    }
  },

  update: function (tile, tileOffset, palette) {
    let x, y;
    if (tileOffset < 32) {
      x = tileOffset;
      y = 0;
    } else {
      x = tileOffset % 32;
      y = (tileOffset - x) / 32;
    }

    this.data[tileOffset] = tile;

    const attrByte = getAttrByte(x, y);
    const attrQuadrant = getAttrByteQuadrant(x, y);
    this.setAttrByteQuadrant(attrByte, attrQuadrant, palette.index);
  },

  setAttrByteQuadrant: function (byte, quadrant, index) {
    let newByte = this.attrs[byte];
    switch (index) {
      case 0:
        newByte = bit.off(newByte, quadrant);
        newByte = bit.off(newByte, quadrant + 1);
        break;
      case 1:
        newByte = bit.off(newByte, quadrant);
        newByte = bit.on(newByte, quadrant + 1);
        break;
      case 2:
        newByte = bit.on(newByte, quadrant);
        newByte = bit.off(newByte, quadrant + 1);
        break;
      case 3:
        newByte = bit.on(newByte, quadrant);
        newByte = bit.on(newByte, quadrant + 1);
        break;
    }
    this.attrs[byte] = newByte;
  }
};

function getAttrByte (x, y) {
  const attrFineRow = y % 4;
  const attrFineCol = x % 4;
  const attrRow = (y - attrFineRow) / 4;
  const attrCol = (x - attrFineCol) / 4;

  return (attrRow * 8) + attrCol;
}

// return starting bit (0 = highest bit) of
// the attribute byte for this position's palette
function getAttrByteQuadrant (x, y) {
  const attrFineRow = y % 4;
  const attrFineCol = x % 4;

  if (attrFineRow < 2) {
    if (attrFineCol < 2) {
      // top left
      return 6;
    } else {
      // top right
      return 4;
    }
  } else {
    if (attrFineCol < 2) {
      // bottom left
      return 2;
    } else {
      // bottom right
      return 0;
    }
  }
}

// return palette index (0-3) for a given quadrant
// of an attr table byte
function getAttrPalette (byte, quadrant) {
  const highBit = bit.get(byte, quadrant);
  const lowBit = bit.get(byte, quadrant + 1);
  const binaryString = `${highBit}${lowBit}`;

  return parseInt(binaryString, 2);
}

exports.Nametable = Nametable;
exports.getAttrByte = getAttrByte;
exports.getAttrByteQuadrant = getAttrByteQuadrant;
