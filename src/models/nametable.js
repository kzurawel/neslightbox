const { COLORS } = require('./colors.js');

function Nametable () {
  this.data = new Uint8Array(960);
  this.attrs = new Uint8Array(64);
  this.filepath = '';
  this.filename = '';
}

Nametable.prototype = {
  draw: function (ctx, tileset, palettes) {
    ctx.fillStyle = COLORS[palettes[0].colors[0]];
    ctx.fillRect(0, 0, 256, 240);
    for (let i = 0; i < 960; i++) {
      const tile = tileset.bank === 0 ? this.data[i] : this.data[i] + 256;
      if (tile === 0) { continue; }
      let x, y;
      if (i < 32) {
        x = i;
        y = 0;
      } else {
        x = i % 32;
        y = (i - x) / 32;
      }
      x = x * 8;
      y = y * 8;

      tileset.tiles[tile].draw(ctx, x, y, palettes[1]);
    }
  },

  update: function (ctx, tileOffset, tileset, palette) {
    let x, y;
    if (tileOffset < 32) {
      x = tileOffset;
      y = 0;
    } else {
      x = tileOffset % 32;
      y = (tileOffset - x) / 32;
    }

    x = x * 8;
    y = y * 8;

    ctx.fillStyle = COLORS[palette.colors[0]];
    ctx.fillRect(x, y, 8, 8);

    const tile = tileset.bank === 0 ? this.data[tileOffset] : this.data[tileOffset] + 256;

    tileset.tiles[tile].draw(ctx, x, y, palette);
  }
};
exports.Nametable = Nametable;
