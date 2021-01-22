const { ipcRenderer } = require('electron');
const { Tileset } = require('./models/tileset.js');
const {
  convertNCToTileOffset,
  nametableStatusBar,
  convertTCToTileOffset,
  tilesetStatusBar
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

// "global" vars
let nTileGridOn = false;
let nAttrGridOn = false;
let tGridOn = false;
let currentTileset;
let currentBank = 0;
let currentTile = false;

// event listeners
nc.addEventListener('mousemove', handleNCMouseMove);
tc.addEventListener('mousemove', handleTCMouseMove);
tc.addEventListener('click', handleTCClick);
nTileGridButton.addEventListener('click', handleNTileGridButton);
nAttrGridButton.addEventListener('click', handleNAttrGridButton);
tGridButton.addEventListener('click', handleTGridButton);
bankSelector.forEach((radio) => {
  radio.addEventListener('change', () => { handleBankSelector(radio.value); });
});

ipcRenderer.on('CHR_OPEN', (event, args) => {
  console.log('got CHR_OPEN', event, args);
  const t = new Tileset();
  t.load(args.data, args.path);
  currentTileset = t;
  tilesetLabel.innerHTML = t.filename;
  updateTilesets(getTilesetProps());
});

// implementing functions

function getTilesetProps () {
  return {
    context: tctx,
    tileset: currentTileset,
    bank: currentBank,
    grid: tGridOn,
    selected: currentTile
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
  updateNametableGrid(nctx, nTileGridOn, nAttrGridOn);
}

function handleNAttrGridButton (e) {
  nAttrGridOn = !nAttrGridOn;
  updateNametableGrid(nctx, nTileGridOn, nAttrGridOn);
}

function handleTGridButton (e) {
  tGridOn = !tGridOn;
  updateTilesets(getTilesetProps());
}

function handleBankSelector (value) {
  currentBank = parseInt(value, 10);
  currentTile = false;
  updateTilesets(getTilesetProps());
}

function handleTCClick (e) {
  const x = Math.floor((e.offsetX / tc.clientWidth) * 256);
  const y = Math.floor((e.offsetY / tc.clientHeight) * 256);
  const tileOffset = convertTCToTileOffset(x, y);

  currentTile = tileOffset;
  updateTilesets(getTilesetProps());
}
