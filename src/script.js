const { ipcRenderer } = require('electron');
const { Tileset } = require('./models/tileset.js');
const { Palette } = require('./models/palette.js');
const { Nametable } = require('./models/nametable.js');
const {
  convertNCToTileOffset,
  nametableStatusBar,
  convertTCToTileOffset,
  tilesetStatusBar,
  convertCCToColor
} = require('./utils/tilemapping.js');
const {
  updateNametableGrid,
  updateTilesets,
  updateColors
} = require('./utils/drawing.js');

// set up canvases
const nc = document.querySelector('#nametabledisplay');
const nctx = nc.getContext('2d', { alpha: false });
nctx.fillStyle = 'black';
nctx.fillRect(0, 0, 512, 480);

const ngc = document.querySelector('#nametablegrid');
const ngctx = ngc.getContext('2d');
ngctx.fillStyle = '#00000000';
ngctx.fillRect(0, 0, 512, 480);

const tc = document.querySelector('#tilesetdisplay');
const tctx = tc.getContext('2d', { alpha: false });
tctx.fillStyle = 'black';
tctx.fillRect(0, 0, 256, 256);

const cc = document.querySelector('#colordisplay');
const cctx = cc.getContext('2d', { alpha: false });
updateColors(cctx);

// set up dom references
const statusbar = document.querySelector('.statusbar p');
const nTileGridButton = document.querySelector('#nTileGridButton');
const nAttrGridButton = document.querySelector('#nAttrGridButton');
const tGridButton = document.querySelector('#tGridButton');
const bankSelector = document.querySelectorAll('input[name="bank"]');
const tilesetLabel = document.querySelector('.tileset .label');

// palettes
const p0c = document.querySelector('#palette0');
const p1c = document.querySelector('#palette1');
const p2c = document.querySelector('#palette2');
const p3c = document.querySelector('#palette3');

// "global" vars
let nTileGridOn = false;
let nAttrGridOn = false;
let tGridOn = false;
const tileset = new Tileset();
let currentTile = false;
let currentPalette = 0;
let currentColorIndex = false;
const currentNametable = new Nametable(); // make mutable later

// default palettes
const palettes = [
  new Palette(['0d', '00', '10', '20'], p0c.getContext('2d', { alpha: false })),
  new Palette(['0d', '01', '11', '21'], p1c.getContext('2d', { alpha: false })),
  new Palette(['0d', '06', '16', '26'], p2c.getContext('2d', { alpha: false })),
  new Palette(['0d', '09', '19', '29'], p3c.getContext('2d', { alpha: false }))
];

palettes.forEach((palette) => {
  palette.update();
});

// event listeners
ngc.addEventListener('mousemove', handleNCMouseMove); // grid because it's on top
ngc.addEventListener('click', handleNCClick); // same here
tc.addEventListener('mousemove', handleTCMouseMove);
tc.addEventListener('click', handleTCClick);
nTileGridButton.addEventListener('click', handleNTileGridButton);
nAttrGridButton.addEventListener('click', handleNAttrGridButton);
tGridButton.addEventListener('click', handleTGridButton);
bankSelector.forEach((radio) => {
  radio.addEventListener('change', () => { handleBankSelector(radio.value); });
});
p0c.addEventListener('mousemove', handlePaletteMouseMove);
p1c.addEventListener('mousemove', handlePaletteMouseMove);
p2c.addEventListener('mousemove', handlePaletteMouseMove);
p3c.addEventListener('mousemove', handlePaletteMouseMove);
p0c.addEventListener('mouseleave', clearStatusBar);
p1c.addEventListener('mouseleave', clearStatusBar);
p2c.addEventListener('mouseleave', clearStatusBar);
p3c.addEventListener('mouseleave', clearStatusBar);
p0c.addEventListener('click', handlePaletteClick);
p1c.addEventListener('click', handlePaletteClick);
p2c.addEventListener('click', handlePaletteClick);
p3c.addEventListener('click', handlePaletteClick);
cc.addEventListener('mousemove', handleCCMouseMove);
cc.addEventListener('click', handleCCClick);

ipcRenderer.on('CHR_OPEN', (event, args) => {
  console.log('got CHR_OPEN', event, args);
  tileset.load(args.data, args.path, args.file);
  tilesetLabel.innerHTML = tileset.filename;
  updateTilesets(getTilesetProps());
});

// implementing functions

function getTilesetProps () {
  return {
    context: tctx,
    tileset,
    grid: tGridOn,
    selected: currentTile,
    palette: palettes[currentPalette]
  };
}

function getNametableGridProps () {
  return {
    ctx: ngctx,
    tileGrid: nTileGridOn,
    attrGrid: nAttrGridOn
  };
}

function handleNCMouseMove (e) {
  const x = Math.floor((e.offsetX / nc.clientWidth) * 512);
  const y = Math.floor((e.offsetY / nc.clientHeight) * 480);
  const tileOffset = convertNCToTileOffset(x, y);
  statusbar.innerHTML = nametableStatusBar(tileOffset);
}

function handleTCMouseMove (e) {
  const x = Math.floor((e.offsetX / tc.clientWidth) * 256);
  const y = Math.floor((e.offsetY / tc.clientHeight) * 256);
  const tileOffset = convertTCToTileOffset(x, y);
  statusbar.innerHTML = tilesetStatusBar(tileOffset);
}

function handleNTileGridButton (e) {
  nTileGridOn = !nTileGridOn;
  updateNametableGrid(getNametableGridProps());
}

function handleNAttrGridButton (e) {
  nAttrGridOn = !nAttrGridOn;
  updateNametableGrid(getNametableGridProps());
}

function handleTGridButton (e) {
  tGridOn = !tGridOn;
  updateTilesets(getTilesetProps());
}

function handleBankSelector (value) {
  tileset.bank = parseInt(value, 10);
  currentTile = false;
  updateTilesets(getTilesetProps());
}

function handleTCClick (e) {
  const x = Math.floor((e.offsetX / tc.clientWidth) * 256);
  const y = Math.floor((e.offsetY / tc.clientHeight) * 256);
  const tileOffset = convertTCToTileOffset(x, y);

  if (currentTile !== tileOffset) {
    currentTile = tileOffset;
  } else {
    currentTile = false;
  }
  updateTilesets(getTilesetProps());
}

function handlePaletteMouseMove (e) {
  let colorIndex = Math.floor((e.offsetX / 96) * 4);
  if (colorIndex > 3) { colorIndex = 3; }
  const palette = parseInt(e.target.dataset.index, 10);

  statusbar.innerHTML = `Palette: ${palette}<span class='spacer'></span>Color: $${palettes[palette].colors[colorIndex]}`;
}

function clearStatusBar () {
  statusbar.innerHTML = '';
}

function handleCCMouseMove (e) {
  const x = Math.floor((e.offsetX / cc.clientWidth) * 256);
  const y = Math.floor((e.offsetY / cc.clientHeight) * 64);
  const color = convertCCToColor(x, y);

  statusbar.innerHTML = `Color: $${color}`;
}

function handlePaletteClick (e) {
  let colorIndex = Math.floor((e.offsetX / 96) * 4);
  if (colorIndex > 3) { colorIndex = 3; }
  const paletteIndex = parseInt(e.target.dataset.index, 10);

  const paletteChanged = paletteIndex !== currentPalette;
  const colorChanged = colorIndex !== currentColorIndex;

  currentPalette = paletteIndex;
  if (paletteChanged || colorChanged) {
    currentColorIndex = colorIndex;
  } else {
    currentColorIndex = false;
  }

  updateTilesets(getTilesetProps());
  for (let i = 0; i < 4; i++) {
    if (i === currentPalette && (paletteChanged || colorChanged)) {
      palettes[i].update(currentColorIndex);
    } else {
      palettes[i].update();
    }
  }
}

function handleCCClick (e) {
  if (currentColorIndex === false) { return; }
  const x = Math.floor((e.offsetX / cc.clientWidth) * 256);
  const y = Math.floor((e.offsetY / cc.clientHeight) * 64);
  const color = convertCCToColor(x, y);

  if (currentColorIndex === 0) {
    // update all color 0's to match
    for (let i = 0; i < 4; i++) {
      palettes[i].colors[currentColorIndex] = color;
      palettes[i].update();
    }
  } else {
    palettes[currentPalette].colors[currentColorIndex] = color;
  }
  palettes[currentPalette].update(currentColorIndex);

  updateTilesets(getTilesetProps());
  currentNametable.draw(nctx, tileset, palettes);
}

function handleNCClick (e) {
  if (currentTile === false) { return; }

  const x = Math.floor((e.offsetX / nc.clientWidth) * 512);
  const y = Math.floor((e.offsetY / nc.clientHeight) * 480);
  const tileOffset = convertNCToTileOffset(x, y);

  currentNametable.data[tileOffset] = currentTile;
  currentNametable.update(nctx, tileOffset, tileset, palettes[currentPalette]);
}
