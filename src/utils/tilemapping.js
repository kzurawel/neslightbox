function convertNCToTileOffset (x, y) {
  const tileCol256 = Math.floor(x / 2);
  const tileRow240 = Math.floor(y / 2);

  const tileColRemainder = tileCol256 % 8;
  const tileRowRemainder = tileRow240 % 8;

  const tileCol = Math.floor((tileCol256 - tileColRemainder) / 8);
  const tileRow = Math.floor((tileRow240 - tileRowRemainder) / 8);

  return (tileRow * 32) + tileCol;
}
exports.convertNCToTileOffset = convertNCToTileOffset;

function hexDisplay (input, width) {
  let result = input.toString(16);
  if (!width) {
    width = result.length;
  }

  while (result.length < width) {
    result = '0' + result;
  }

  return result;
}
exports.hexDisplay = hexDisplay;

function getNametableAddresses (input) {
  const nametableStarts = [
    parseInt('2000', 16),
    parseInt('2400', 16),
    parseInt('2800', 16),
    parseInt('2c00', 16)
  ];

  let result = '';
  nametableStarts.forEach((start) => {
    result += `$${(start + input).toString(16)}, `;
  });
  result = result.slice(0, result.length - 2);

  return result;
}
exports.getNametableAddresses = getNametableAddresses;

function getAttrOffset (tile) {
  const col = tile % 32;
  const row = (tile - col) / 32;

  const offset = ((col - (col % 4)) / 4) + (((row - (row % 4)) / 4) * 8);

  return offset;
}
exports.getAttrOffset = getAttrOffset;

function getAttrAddresses (offset) {
  const attrStarts = [
    parseInt('23c0', 16),
    parseInt('27c0', 16),
    parseInt('2bc0', 16),
    parseInt('2fc0', 16)
  ];
  offset = parseInt(offset, 16);

  let result = '';
  attrStarts.forEach((start) => {
    result += `$${(start + offset).toString(16)}, `;
  });
  result = result.slice(0, result.length - 2);

  return result;
}
exports.getAttrAddresses = getAttrAddresses;

function nametableStatusBar (tile) {
  const nOffset = hexDisplay(tile, 4);
  const nAddresses = getNametableAddresses(tile);
  const aOffset = hexDisplay(getAttrOffset(tile), 2);
  const aAddresses = getAttrAddresses(aOffset);
  return `Nametable offset: $${nOffset} (${nAddresses})   Attribute offset: $${aOffset} (${aAddresses})`;
}
exports.nametableStatusBar = nametableStatusBar;

function convertTCToTileOffset (x, y) {
  const tileCol128 = Math.floor(x / 2);
  const tileRow128 = Math.floor(y / 2);

  const tileColRemainder = tileCol128 % 8;
  const tileRowRemainder = tileRow128 % 8;

  const tileCol = Math.ceil((tileCol128 - tileColRemainder) / 8);
  let tileRow = Math.ceil((tileRow128 - tileRowRemainder) / 8);

  if (tileRow > 15) { tileRow = 15; }

  return (tileRow * 16) + tileCol;
}
exports.convertTCToTileOffset = convertTCToTileOffset;

function tilesetStatusBar (tile) {
  return `Tile: $${hexDisplay(tile, 2)}`;
}
exports.tilesetStatusBar = tilesetStatusBar;
