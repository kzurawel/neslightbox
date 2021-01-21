const { ipcRenderer } = require('electron');
const { Tileset } = require('./models/tileset.js');
const {
  convertNCToTileOffset,
  nametableStatusBar
} = require('./utils/tilemapping.js');

// set up canvases
const nc = document.querySelector('#nametabledisplay');
const nctx = nc.getContext('2d', { alpha: false });
nctx.fillStyle = 'black';
nctx.fillRect(0, 0, 512, 480);

// set up dom references
const statusbar = document.querySelector('.statusbar p');
const nTileGridButton = document.querySelector('#nTileGridButton');
const nAttrGridButton = document.querySelector('#nAttrGridButton');

// "global" vars
let nTileGridOn = false;
let nAttrGridOn = false;

// event listeners
nc.addEventListener('mousemove', handleMouseMove);
nTileGridButton.addEventListener('click', handleNTileGridButton);
nAttrGridButton.addEventListener('click', handleNAttrGridButton);

ipcRenderer.on('CHR_OPEN', (event, args) => {
  console.log('got CHR_OPEN', event, args);
  const t = new Tileset();
  t.load(args.data);
});

// implementing functions

function handleMouseMove (e) {
  const x = Math.floor((e.offsetX / nc.clientWidth) * 512);
  const y = Math.floor((e.offsetY / nc.clientHeight) * 480);

  const tileOffset = convertNCToTileOffset(x, y);
  statusbar.innerHTML = nametableStatusBar(tileOffset);
}

function handleNTileGridButton (e) {
  nTileGridOn = !!nTileGridOn;
}

function handleNAttrGridButton (e) {
  nAttrGridOn = !!nAttrGridOn;
}
