const fs = require('fs');
const { ipcRenderer } = require('electron');
const { COLORS } = require('./models/colors.js');
const bit = require('./utils/bitFns.js');
const { Tileset } = require('./models/tileset.js');
const { Tile } = require('./models/tile.js');
const { Palette, savePalettes } = require('./models/palette.js');
const { Nametable } = require('./models/nametable.js');
const { Project } = require('./models/project.js');
const {
  convertNCToTileOffset,
  nametableStatusBar,
  convertTCToTileOffset,
  tilesetStatusBar,
  convertCCToColor,
  hexDisplay
} = require('./utils/tilemapping.js');
const {
  updateNametableGrid,
  updateTilesets,
  updateTilesetGrid,
  updateColors,
  updateTileEditorGrid
} = require('./utils/drawing.js');
const { getFileName } = require('./utils/files.js');

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
const teFlipHorizontalButton = document.querySelector('#teFlipHorizontalButton');
const teFlipVerticalButton = document.querySelector('#teFlipVerticalButton');
const teRotateCWButton = document.querySelector('#teRotateCWButton');
const teRotateCCWButton = document.querySelector('#teRotateCCWButton');
const palettesLabel = document.querySelector('.paletteswrapper .label');
const nametableLabel = document.querySelector('.nametable .label');
const windowTitle = document.querySelector('head title');

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
let palettesFilePath = false;
const project = new Project();
const defaultWindowTitle = 'NES Lightbox';

// turn off Save button if no current file
ipcRenderer.send('ALLOW_CHR_SAVE', false);
ipcRenderer.send('ALLOW_NAMETABLE_SAVE', false);
ipcRenderer.send('ALLOW_PALETTES_SAVE', false);
ipcRenderer.send('ALLOW_PROJECT_SAVE', false);

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
teFlipHorizontalButton.addEventListener('click', handleTEFlipHorizontalButton);
teFlipVerticalButton.addEventListener('click', handleTEFlipVerticalButton);
teRotateCWButton.addEventListener('click', handleTERotateCWButton);
teRotateCCWButton.addEventListener('click', handleTERotateCCWButton);
tepc.addEventListener('click', handleTEPaletteClick);
tegc.addEventListener('click', handleTileEditorClick);

ipcRenderer.on('CHR_OPEN', (event, args) => {
  console.log('got CHR_OPEN', event, args);
  tileset.load(args.data, args.path, args.file);
  tilesetLabel.innerHTML = tileset.filename;
  project.tileset = tileset.filepath;
  updateTilesets(getTilesetProps());
  currentNametable.draw(nctx, tileset, palettes);
});

ipcRenderer.on('CHR_SAVE_AS', (event, args) => {
  console.log('got CHR_SAVE_AS', event, args);
  tileset.save(args.file.filePath);
});

ipcRenderer.on('CHR_SAVE', (event, args) => {
  console.log('got CHR_SAVE', event, args);
  tileset.save(tileset.filepath);
});

ipcRenderer.on('NAMETABLE_OPEN', (event, args) => {
  console.log('got NAMETABLE_OPEN', event, args);
  currentNametable.load(args.data, args.path, args.file);
  nametableLabel.innerHTML = currentNametable.filename;
  project.nametable = currentNametable.filepath;
  currentNametable.draw(nctx, tileset, palettes);
});

ipcRenderer.on('NAMETABLE_SAVE_AS', (event, args) => {
  console.log('got NAMETABLE_SAVE_AS', event, args);
  currentNametable.save(args.file.filePath);
});

ipcRenderer.on('NAMETABLE_SAVE', (event, args) => {
  console.log('got NAMETABLE_SAVE', event, args);
  currentNametable.save(currentNametable.filePath);
});

ipcRenderer.on('PALETTES_OPEN', (event, args) => {
  console.log('got PALETTES_OPEN', event, args);
  palettesFilePath = args.path;
  palettesLabel.innerHTML = args.file;
  project.palettes = args.path;
  loadPalettes(args.data, args.path, args.file);
  currentNametable.draw(nctx, tileset, palettes);
});

ipcRenderer.on('PALETTES_SAVE_AS', (event, args) => {
  console.log('got PALETTES_SAVE_AS', event, args);
  palettesFilePath = args.file.filePath;
  savePalettes(args.file.filePath, palettes);
});

ipcRenderer.on('PALETTES_SAVE', (event, args) => {
  console.log('got PALETTES_SAVE', event, args);
  savePalettes(palettesFilePath, palettes);
});

ipcRenderer.on('PROJECT_OPEN', (event, args) => {
  console.log('got PROJECT_OPEN', event, args);
  project.load(args.options);
  // tileset
  if (project.tileset) {
    const tilesetData = fs.readFileSync(project.tileset);
    tileset.load(tilesetData, project.tileset, getFileName(project.tileset));
    tilesetLabel.innerHTML = tileset.filename;
    updateTilesets(getTilesetProps());
    currentNametable.draw(nctx, tileset, palettes);
  }
  // nametable
  if (project.nametable) {
    const nametableData = fs.readFileSync(project.nametable);
    currentNametable.load(nametableData, project.nametable, getFileName(project.nametable));
    nametableLabel.innerHTML = currentNametable.filename;
    currentNametable.draw(nctx, tileset, palettes);
  }
  // bank
  bankSelector[project.bank].click();
  // palettes
  if (project.palettes) {
    const palettesData = fs.readFileSync(project.palettes);
    loadPalettes(palettesData, project.palettes, getFileName(project.palettes));
    palettesLabel.innerHTML = getFileName(project.palettes);
    updateTilesets(getTilesetProps());
    currentNametable.draw(nctx, tileset, palettes);
  }
  windowTitle.innerHTML = `${defaultWindowTitle} | ${args.options.filename}`;
});

ipcRenderer.on('PROJECT_SAVE_AS', (event, args) => {
  console.log('got PROJECT_SAVE_AS', event, args);
  const values = {
    nametable: currentNametable,
    tileset: tileset,
    palettes: palettes
  };
  project.save(args.file.filePath, values);
});

ipcRenderer.on('PROJECT_SAVE_FILES', (event, args) => {
  console.log('got PROJECT_SAVE_FILES');
  const values = {
    nametable: currentNametable,
    tileset: tileset,
    palettes: palettes
  };
  project.save(project.filepath, values);
  project.saveFiles(values);
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
  project.bank = tileset.bank;
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

function handleTEFlipHorizontalButton (e) {
  editorTile.flipHorizontal();
  editorTile.draw(tecctx, 0, 0, editorPalette);
}

function handleTEFlipVerticalButton (e) {
  editorTile.flipVertical();
  editorTile.draw(tecctx, 0, 0, editorPalette);
}

function handleTERotateCWButton (e) {
  editorTile.rotateCW();
  editorTile.draw(tecctx, 0, 0, editorPalette);
}

function handleTERotateCCWButton (e) {
  editorTile.rotateCCW();
  editorTile.draw(tecctx, 0, 0, editorPalette);
}

function loadPalettes (data, filepath, filename) {
  if (data.length === 16) {
    for (let i = 0; i < 4; i++) {
      palettes[0].colors[i] = hexDisplay(data[i], 2);
      palettes[1].colors[i] = hexDisplay(data[i + 4], 2);
      palettes[2].colors[i] = hexDisplay(data[i + 8], 2);
      palettes[3].colors[i] = hexDisplay(data[i + 12], 2);
    }

    for (let i = 0; i < 4; i++) {
      palettes[i].update();
    }

    ipcRenderer.send('ALLOW_PALETTES_SAVE', true);
  } else {
    throw new Error(`Unsupported palette file size: ${data.length}, should be 16 bytes`);
  }
}
