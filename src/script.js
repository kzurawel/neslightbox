const { ipcRenderer } = require('electron');
const { Tileset } = require('./models/tileset.js');

// set up canvases
const nc = document.querySelector('#nametabledisplay');
const nctx = nc.getContext('2d', { alpha: false });
nctx.fillStyle = 'black';
nctx.fillRect(0, 0, 512, 480);

nc.addEventListener('mousemove', handleMouseMove);

let t;

ipcRenderer.on('CHR_OPEN', (event, args) => {
  console.log('got CHR_OPEN', event, args);
  t = new Tileset();
  t.load(args.data);
});

function handleMouseMove(e) {
  // TODO: convert x/y to 0-255 / 0-239 scale
  let x = e.offsetX;
  let y = e.offsetY;

  console.log('mouse:', x, y);
}
