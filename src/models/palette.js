const fs = require('fs');
const { COLORS } = require('./colors.js');
function Palette (colors, context, index) {
  if (colors && colors.length === 4) {
    this.colors = colors;
    this.context = context;
  } else {
    this.colors = [];
    this.context = false;
  }
  this.index = index;
}

Palette.prototype = {
  update: function (selected) {
    for (let i = 0; i < 4; i++) {
      this.context.fillStyle = COLORS[this.colors[i]];
      this.context.fillRect(i * 24, 0, i * 24 + 24, 24);
    }

    if (selected !== false) {
      this.context.strokeStyle = '#ff0';
      this.context.lineWidth = 2;
      this.context.strokeRect(selected * 24, 0, 24, 24);
    }
  }
};
exports.Palette = Palette;

function savePalettes (filepath, palettes) {
  const buffer = Buffer.alloc(16);
  for (let i = 0; i < 4; i++) {
    buffer[i] = parseInt(palettes[0].colors[i], 16);
    buffer[i + 4] = parseInt(palettes[1].colors[i], 16);
    buffer[i + 8] = parseInt(palettes[2].colors[i], 16);
    buffer[i + 12] = parseInt(palettes[3].colors[i], 16);
  }

  fs.writeFile(filepath, buffer, (err) => {
    if (err) { console.error(err); }
  });
}
exports.savePalettes = savePalettes;
