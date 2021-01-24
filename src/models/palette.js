const { COLORS } = require('./colors.js');
function Palette (colors, context) {
  if (colors && colors.length === 4) {
    this.colors = colors;
    this.context = context;
  } else {
    this.colors = [];
    this.context = false;
  }
}

Palette.prototype = {
  update: function (selected) {
    for (let i = 0; i < 4; i++) {
      this.context.fillStyle = COLORS[this.colors[i]];
      this.context.fillRect(i * 24, 0, i * 24 + 24, 24);
    }

    if (selected) {
      this.context.strokeStyle = '#ff0';
      this.context.lineWidth = 2;
      this.context.strokeRect(selected * 24, 0, 24, 24);
    }
  }
};
exports.Palette = Palette;
