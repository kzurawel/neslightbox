const { ipcRenderer } = require('electron');
const { COLORS } = require('./models/colors.js');
const bit = require('./utils/bitFns.js');
const { Tileset } = require('./models/tileset.js');
const { Tile } = require('./models/tile.js');
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
  updateTilesetGrid,
  updateColors,
  updateTileEditorGrid
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

const tgc = document.querySelector('#tilesetgrid');
const tgcctx = tgc.getContext('2d');

const cc = document.querySelector('#colordisplay');
const cctx = cc.getContext('2d', { alpha: false });
updateColors(cctx);

const tec = document.querySelector('#tileeditor');
const tecctx = tec.getContext('2d', { alpha: false });

const tegc = document.querySelector('#tileeditorgrid');
const tegcctx = tegc.getContext('2d');

const tepc = document.querySelector('#tileeditorpalette');
const tepcctx = tepc.getContext('2d', { alpha: false });

// set up dom references
const statusbar = document.querySelector('.statusbar p');
const nTileGridButton = document.querySelector('#nTileGridButton');
const nAttrGridButton = document.querySelector('#nAttrGridButton');
const tGridButton = document.querySelector('#tGridButton');
const bankSelector = document.querySelectorAll('input[name="bank"]');
const tilesetLabel = document.querySelector('.tileset .label');
const tEditButton = document.querySelector('#tEditButton');
const tileEditorWindow = document.querySelector('.tileeditbg');
const teGridButton = document.querySelector('#teGridButton');
const teCancelButton = document.querySelector('#teCancelButton');
const teSaveButton = document.querySelector('#teSaveButton');

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
const currentNametable = new Nametable(); // make mutable later?
let teGridOn = false;
let teSelectedColor = 0;
let editorPalette = false;
let editorTile = false;

// turn off Save button if no current file
ipcRenderer.send('ALLOW_CHR_SAVE', false);

// default palettes
const palettes = [
  new Palette(['0d', '00', '10', '20'], p0c.getContext('2d', { alpha: false }), 0),
  new Palette(['0d', '01', '11', '21'], p1c.getContext('2d', { alpha: false }), 1),
  new Palette(['0d', '06', '16', '26'], p2c.getContext('2d', { alpha: false }), 2),
  new Palette(['0d', '09', '19', '29'], p3c.getContext('2d', { alpha: false }), 3)
];

palettes.forEach((palette) => {
  palette.update();
});

// event listeners
ngc.addEventListener('mousemove', handleNCMouseMove); // grid because it's on top
ngc.addEventListener('click', handleNCClick); // same here
tgc.addEventListener('mousemove', handleTCMouseMove);
tgc.addEventListener('click', handleTCClick);
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
tEditButton.addEventListener('click', handleTEditButton);
teCancelButton.addEventListener('click', handleTECancelButton);
teGridButton.addEventListener('click', handleTEGridButton);
teSaveButton.addEventListener('click', handleTESaveButton);
tepc.addEventListener('click', handleTEPaletteClick);
tegc.addEventListener('click', handleTileEditorClick);

ipcRenderer.on('CHR_OPEN', (event, args) => {
  console.log('got CHR_OPEN', event, args);
  tileset.load(args.data, args.path, args.file);
  tilesetLabel.innerHTML = tileset.filename;
  updateTilesets(getTilesetProps());
});

ipcRenderer.on('CHR_SAVE_AS', (event, args) => {
  console.log('got CHR_SAVE_AS', event, args);
  tileset.save(args.file.filePath);
});

ipcRenderer.on('CHR_SAVE', (event, args) => {
  console.log('got CHR_SAVE', event, args);
  tileset.save(tileset.filepath);
});

// implementing functions

function getTilesetProps () {
  return {
    context: tctx,
    tileset,
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
  updateTilesetGrid(tgcctx, tGridOn, currentTile);
}

function handleBankSelector (value) {
  tileset.bank = parseInt(value, 10);
  currentTile = false;
  updateTilesets(getTilesetProps());
  updateTilesetGrid(tgcctx, tGridOn, currentTile);
  currentNametable.draw(nctx, tileset, palettes);
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

  if (currentTile !== false) {
    tEditButton.disabled = false;
  } else {
    tEditButton.disabled = true;
  }
  updateTilesets(getTilesetProps());
  updateTilesetGrid(tgcctx, tGridOn, currentTile);
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

  currentNametable.update(currentTile, tileOffset, palettes[currentPalette]);
  currentNametable.draw(nctx, tileset, palettes);
}

function handleTEditButton (e) {
  if (currentTile === false) { return; }

  editorPalette = new Palette(palettes[currentPalette].colors, tepcctx);
  const tileToLoad = tileset.bank === 0 ? currentTile : currentTile + 256;
  const tile = tileset.tiles[tileToLoad];

  editorTile = new Tile(tile.data);

  editorTile.draw(tecctx, 0, 0, editorPalette);
  editorPalette.update(teSelectedColor);

  tileEditorWindow.classList.remove('hidden');
}

function handleTECancelButton (e) {
  tileEditorWindow.classList.add('hidden');
}

function handleTEGridButton (e) {
  teGridOn = !teGridOn;
  updateTileEditorGrid(tegcctx, teGridOn);
}

function handleTEPaletteClick (e) {
  let colorIndex = Math.floor((e.offsetX / 96) * 4);
  if (colorIndex > 3) { colorIndex = 3; }
  teSelectedColor = colorIndex;

  editorPalette.update(teSelectedColor);
}

function handleTileEditorClick (e) {
  const x = Math.floor((e.offsetX / tegc.clientWidth) * 8);
  const y = Math.floor((e.offsetY / tegc.clientHeight) * 8);

  tecctx.fillStyle = COLORS[editorPalette.colors[teSelectedColor]];
  tecctx.fillRect(x, y, 1, 1);

  switch (teSelectedColor) {
    case 0:
      // turn off both bits
      editorTile.data[y] = bit.off(editorTile.data[y], x);
      editorTile.data[y + 8] = bit.off(editorTile.data[y + 8], x);
      break;
    case 1:
      // turn on first, off second
      editorTile.data[y] = bit.on(editorTile.data[y], x);
      editorTile.data[y + 8] = bit.off(editorTile.data[y + 8], x);
      break;
    case 2:
      // turn off first, on second
      editorTile.data[y] = bit.off(editorTile.data[y], x);
      editorTile.data[y + 8] = bit.on(editorTile.data[y + 8], x);
      break;
    case 3:
      // turn both on
      editorTile.data[y] = bit.on(editorTile.data[y], x);
      editorTile.data[y + 8] = bit.on(editorTile.data[y + 8], x);
  }
}

function handleTESaveButton (e) {
  tileset.updateTile(currentTile, editorTile);
  updateTilesets(getTilesetProps());
  updateTilesetGrid(tgcctx, tGridOn, currentTile);
  tileEditorWindow.classList.add('hidden');
}
