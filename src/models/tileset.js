const { Tile } = require('./tile.js');

function Tileset () {
  this.rawData = new Uint8Array(8192);
  this.tiles = [];
  this.is8x16 = false; // for 8x16 tiles
  this.filename = '';
}

Tileset.prototype = {
  load: function (buffer, filename) {
    if (buffer.length === 8192) {
      this.filename = filename;
      for (let i = 0; i < buffer.length; i++) {
        this.rawData[i] = buffer[i];
      }
      for (let i = 0; i < 512; i++) {
        this.tiles[i] = new Tile(buffer.slice(i * 16, (i * 16) + 16));
      }
    } else {
      throw new Error(`Unsupported CHR size: ${buffer.length}`);
    }
  }
};

exports.Tileset = Tileset;
