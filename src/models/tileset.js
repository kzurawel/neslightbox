const { Tile } = require('./tile.js');

function Tileset () {
  this.rawData = new Uint8Array(8192);
  this.tiles = [];
  this.is8x16 = false; // for 8x16 tiles
  this.filename = '';
}

Tileset.prototype = {
  load: function (buffer) {
    if (buffer.length === 8192) {
      for (let i = 0; i < buffer.length; i++) {
        this.rawData[i] = buffer[i];
      }
      for (let i = 0; i < 16; ++i) {
        for (let j = 0; j < 16; ++j) {
          const which = i * 16 + j;
          this.tiles[which] = new Tile(buffer.slice(which, which + 16));
        }
      }
    } else {
      throw new Error(`Unsupported CHR size: ${buffer.length}`);
    }
  }
};

exports.Tileset = Tileset;
