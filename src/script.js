const { ipcRenderer } = require('electron');
const { Tileset } = require('./models/tileset.js');

let t;

ipcRenderer.on('CHR_OPEN', (event, args) => {
  console.log('got CHR_OPEN', event, args);
  t = new Tileset();
  t.load(args.data);
});
