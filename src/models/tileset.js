const { Tile } = require('./tile.js');

function Tileset () {
  this.rawData = new Uint8Array(8192);
  this.tiles = new Array(512);
  for (let i = 0; i < 512; i++) {
    this.tiles[i] = new Tile();
  }
  this.is8x16 = false; // for 8x16 tiles
  this.filepath = '';
  this.filename = '';
  this.bank = 0;
}

Tileset.prototype = {
  load: function (buffer, filepath, filename) {
    if (buffer.length === 8192) {
      this.filepath = filepath;
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
  },
  updateTile: function (offset, tile) {
    const tileOffset = this.bank === 0 ? offset : offset + 256;

    for (let i = 0; i < 16; i++) {
      this.tiles[tileOffset].data[i] = tile.data[i];
      this.rawData[(tileOffset * 16) + i] = tile.data[i];
    }
  }
};

exports.Tileset = Tileset;
