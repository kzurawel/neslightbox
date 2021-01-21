const { ipcRenderer } = require('electron');
const { Tileset } = require('./models/tileset.js');
const {
  convertNCToTileOffset,
  hexDisplay,
  getNametableAddresses,
  getAttrOffset,
  getAttrAddresses
} = require('./utils/tilemapping.js');

// set up canvases
const nc = document.querySelector('#nametabledisplay');
const nctx = nc.getContext('2d', { alpha: false });
nctx.fillStyle = 'black';
nctx.fillRect(0, 0, 512, 480);

// grab statusbar reference
const statusbar = document.querySelector('.statusbar p');

nc.addEventListener('mousemove', handleMouseMove);

let t;

ipcRenderer.on('CHR_OPEN', (event, args) => {
  console.log('got CHR_OPEN', event, args);
  t = new Tileset();
  t.load(args.data);
});

function handleMouseMove (e) {
  const x = Math.floor((e.offsetX / nc.clientWidth) * 512);
  const y = Math.floor((e.offsetY / nc.clientHeight) * 480);

  const tileOffset = convertNCToTileOffset(x, y);
  statusbar.innerHTML = nametableStatusBar(tileOffset);
}

function nametableStatusBar(tile) {
  const nOffset = hexDisplay(tile, 4);
  const nAddresses = getNametableAddresses(tile);
  const aOffset = hexDisplay(getAttrOffset(tile), 4);
  const aAddresses = getAttrAddresses(aOffset);
  return `Nametable offset: $${nOffset} (${nAddresses})   Attribute offset: $${aOffset} (${aAddresses})`;
}
