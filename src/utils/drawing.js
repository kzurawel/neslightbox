const { COLORS } = require('../models/colors.js');

function updateNametableGrid (nctx, nTileGridOn, nAttrGridOn) {
  nctx.fillStyle = 'black';
  nctx.fillRect(0, 0, 512, 480);
  nctx.strokeStyle = '#fff';
  nctx.lineWidth = 1;

  if (nTileGridOn) {
    // vertical lines
    for (let i = 0; i < 512; i = i + 16) {
      if (i % 64 === 0 && nAttrGridOn) {
        nctx.strokeStyle = '#f66';
        nctx.setLineDash([8, 8]);
      } else {
        nctx.strokeStyle = '#fff';
        nctx.setLineDash([1, 7]);
      }
      nctx.beginPath();
      nctx.moveTo(i + 0.5, 0.5);
      nctx.lineTo(i + 0.5, 479.5);
      nctx.stroke();
      nctx.closePath();
    }

    // horizontal lines
    for (let j = 0; j < 480; j = j + 16) {
      if (j % 64 === 0 && nAttrGridOn) {
        nctx.strokeStyle = '#f66';
        nctx.setLineDash([8, 8]);
      } else {
        nctx.strokeStyle = '#fff';
        nctx.setLineDash([1, 7]);
      }
      nctx.beginPath();
      nctx.moveTo(0.5, j + 0.5);
      nctx.lineTo(511.5, j + 0.5);
      nctx.stroke();
      nctx.closePath();
    }
  }

  if (nAttrGridOn && !nTileGridOn) {
    nctx.strokeStyle = '#f66';
    nctx.setLineDash([8, 8]);
    // vertical lines
    for (let i = 0; i < 512; i = i + 64) {
      nctx.beginPath();
      nctx.moveTo(i + 0.5, 0.5);
      nctx.lineTo(i + 0.5, 479.5);
      nctx.stroke();
      nctx.closePath();
    }

    // horizontal lines
    for (let j = 0; j < 480; j = j + 64) {
      nctx.beginPath();
      nctx.moveTo(0.5, j + 0.5);
      nctx.lineTo(511.5, j + 0.5);
      nctx.stroke();
      nctx.closePath();
    }
  }
}
exports.updateNametableGrid = updateNametableGrid;

function updateTilesets (options) {
  const { context, tileset, bank, grid, selected } = options;
  context.fillStyle = 'black';
  context.fillRect(0, 0, 256, 256);

  let startTile = 0;
  if (bank === 1) { startTile = 256; }
  const palette = {
    colors: ['0d', '00', '10', '20']
  };

  if (tileset) {
    for (let i = 0; i < 256; i++) {
      const col = i % 16;
      const row = (i - col) / 16;
      tileset.tiles[startTile + i].draw(context, col * 16, row * 16, palette);
    }
  }

  if (grid) {
    context.strokeStyle = '#fff';
    context.lineWidth = 1;
    context.setLineDash([3, 5]);
    for (let i = 0; i < 256; i = i + 16) {
      context.beginPath();
      context.moveTo(i + 0.5, 0.5);
      context.lineTo(i + 0.5, 254.5);
      context.stroke();
      context.closePath();

      context.beginPath();
      context.moveTo(0.5, i + 0.5);
      context.lineTo(254.5, i + 0.5);
      context.stroke();
      context.closePath();
    }
  }

  if (selected || selected === 0) {
    const col = selected % 16;
    const row = (selected - col) / 16;
    const sx = col * 16;
    const sy = row * 16;

    context.strokeStyle = '#99f';
    context.lineWidth = 2;
    context.setLineDash([]);
    context.strokeRect(sx, sy, 16, 16);
  }
}
exports.updateTilesets = updateTilesets;

function updateColors (context) {
  for (let i = 0; i < 56; i++) {
    const col = i % 14;
    const row = (i - col) / 14;

    const sx = col * 16;
    const sy = row * 16;

    const colorVal = `${row}${col.toString(16)}`;

    context.fillStyle = COLORS[colorVal];
    context.fillRect(sx, sy, sx + 16, sy + 16);
  }
}
exports.updateColors = updateColors;
