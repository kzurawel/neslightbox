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

function updateTilesets (tctx, tileset, bank, grid) {
  tctx.fillStyle = 'black';
  tctx.fillRect(0, 0, 256, 256);

  let startTile = 0;
  if (bank === 1) { startTile = 256; }
  const palette = {
    colors: ['0d', '00', '10', '20']
  };

  if (tileset) {
    for (let i = 0; i < 256; i++) {
      const col = i % 16;
      const row = (i - col) / 16;
      tileset.tiles[startTile + i].draw(tctx, col * 16, row * 16, palette);
    }
  }

  if (grid) {
    tctx.strokeStyle = '#fff';
    tctx.lineWidth = 1;
    tctx.setLineDash([3, 5]);
    for (let i = 0; i < 256; i = i + 16) {
      tctx.beginPath();
      tctx.moveTo(i + 0.5, 0.5);
      tctx.lineTo(i + 0.5, 254.5);
      tctx.stroke();
      tctx.closePath();

      tctx.beginPath();
      tctx.moveTo(0.5, i + 0.5);
      tctx.lineTo(254.5, i + 0.5);
      tctx.stroke();
      tctx.closePath();
    }
  }
}
exports.updateTilesets = updateTilesets;
