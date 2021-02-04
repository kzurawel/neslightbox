const { COLORS } = require('../models/colors.js');

function updateNametableGrid (options) {
  const {
    ctx,
    tileGrid,
    attrGrid
  } = options;

  ctx.clearRect(0, 0, 512, 480);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;

  if (tileGrid) {
    // vertical lines
    for (let i = 0; i < 512; i = i + 16) {
      if (i % 64 === 0 && attrGrid) {
        ctx.strokeStyle = '#f66';
        ctx.setLineDash([8, 8]);
      } else {
        ctx.strokeStyle = '#fff';
        ctx.setLineDash([1, 7]);
      }
      ctx.beginPath();
      ctx.moveTo(i + 0.5, 0.5);
      ctx.lineTo(i + 0.5, 479.5);
      ctx.stroke();
      ctx.closePath();
    }

    // horizontal lines
    for (let j = 0; j < 480; j = j + 16) {
      if (j % 64 === 0 && attrGrid) {
        ctx.strokeStyle = '#f66';
        ctx.setLineDash([8, 8]);
      } else {
        ctx.strokeStyle = '#fff';
        ctx.setLineDash([1, 7]);
      }
      ctx.beginPath();
      ctx.moveTo(0.5, j + 0.5);
      ctx.lineTo(511.5, j + 0.5);
      ctx.stroke();
      ctx.closePath();
    }
  }

  if (attrGrid && !tileGrid) {
    ctx.strokeStyle = '#f66';
    ctx.setLineDash([8, 8]);
    // vertical lines
    for (let i = 0; i < 512; i = i + 64) {
      ctx.beginPath();
      ctx.moveTo(i + 0.5, 0.5);
      ctx.lineTo(i + 0.5, 479.5);
      ctx.stroke();
      ctx.closePath();
    }

    // horizontal lines
    for (let j = 0; j < 480; j = j + 64) {
      ctx.beginPath();
      ctx.moveTo(0.5, j + 0.5);
      ctx.lineTo(511.5, j + 0.5);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
exports.updateNametableGrid = updateNametableGrid;

function updateTilesets (options) {
  const { context, tileset, palette } = options;
  context.fillStyle = COLORS[palette.colors[0]];
  context.fillRect(0, 0, 128, 128);

  let startTile = 0;
  if (tileset.bank === 1) { startTile = 256; }

  for (let i = 0; i < 256; i++) {
    const col = i % 16;
    const row = (i - col) / 16;
    tileset.tiles[startTile + i].draw(context, col * 8, row * 8, palette);
  }
}
exports.updateTilesets = updateTilesets;

function updateTilesetGrid (context, grid, selected) {
  context.clearRect(0, 0, 256, 256);
  if (grid) {
    context.strokeStyle = '#fff';
    context.lineWidth = 1;
    for (let i = 0; i < 256; i = i + 16) {
      context.beginPath();
      context.moveTo(i + 0.5, 0.5);
      context.lineTo(i + 0.5, 255.5);
      context.stroke();
      context.closePath();

      context.beginPath();
      context.moveTo(0.5, i + 0.5);
      context.lineTo(255.5, i + 0.5);
      context.stroke();
      context.closePath();
    }
  }

  if (selected !== false) {
    const col = selected % 16;
    const row = (selected - col) / 16;
    const sx = col * 16;
    const sy = row * 16;

    context.strokeStyle = '#ff0';
    context.lineWidth = 2;
    context.strokeRect(sx, sy, 16, 16);
  }
}
exports.updateTilesetGrid = updateTilesetGrid;

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

function updateTileEditorGrid (context, grid) {
  if (!grid) {
    context.clearRect(0, 0, 256, 256);
  } else {
    context.strokeStyle = '#fff';
    context.lineWidth = 1;
    context.setLineDash([1, 7]);
    for (let i = 0; i < 256; i = i + 32) {
      context.beginPath();
      context.moveTo(i + 0.5, 0.5);
      context.lineTo(i + 0.5, 255.5);
      context.stroke();
      context.closePath();

      context.beginPath();
      context.moveTo(0.5, i + 0.5);
      context.lineTo(255.5, i + 0.5);
      context.stroke();
      context.closePath();
    }
  }
}
exports.updateTileEditorGrid = updateTileEditorGrid;
