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
  updateTilesets
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

// set up dom references
const statusbar = document.querySelector('.statusbar p');
const nTileGridButton = document.querySelector('#nTileGridButton');
const nAttrGridButton = document.querySelector('#nAttrGridButton');
const tGridButton = document.querySelector('#tGridButton');

// "global" vars
let nTileGridOn = false;
let nAttrGridOn = false;
let tGridOn = false;
let currentTileset;
const currentBank = 1; // will add toggle soon

// event listeners
nc.addEventListener('mousemove', handleNCMouseMove);
tc.addEventListener('mousemove', handleTCMouseMove);
nTileGridButton.addEventListener('click', handleNTileGridButton);
nAttrGridButton.addEventListener('click', handleNAttrGridButton);
tGridButton.addEventListener('click', handleTGridButton);

ipcRenderer.on('CHR_OPEN', (event, args) => {
  console.log('got CHR_OPEN', event, args);
  const t = new Tileset();
  t.load(args.data);
  currentTileset = t;
  console.log('loaded tileset, updating canvas', t);
  updateTilesets(tctx, currentTileset, currentBank, tGridOn);
});

// implementing functions

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
  updateTilesets(tctx, currentTileset, currentBank, tGridOn);
}
