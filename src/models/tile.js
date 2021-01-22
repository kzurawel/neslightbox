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
  }
};

exports.Tile = Tile;
