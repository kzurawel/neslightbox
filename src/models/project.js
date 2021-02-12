const fs = require('fs');
const { getFileName } = require('../utils/files.js');
const { savePalettes } = require('./palette.js');
const { ipcRenderer } = require('electron');

function Project (options) {
  if (options) {
    this.filename = options.filename ? options.filename : '';
    this.filepath = options.filepath ? options.filepath : '';
    this.nametable = options.nametable ? options.nametable : '';
    this.tileset = options.tileset ? options.tileset : '';
    this.palettes = options.palettes ? options.palettes : '';
    this.bank = options.bank ? options.bank : 0;
  }
}
exports.Project = Project;

Project.prototype = {
  load: function (options) {
    this.filename = options.filename;
    this.filepath = options.filepath;
    this.nametable = options.nametable ? options.nametable : options.filename;
    this.tileset = options.tileset ? options.tileset : options.filename;
    this.palettes = options.palettes ? options.palettes : options.filename;
    this.bank = options.bank ? options.bank : 0;
    ipcRenderer.send('ALLOW_PROJECT_SAVE', true);
  },
  save: function (filepath, values) {
    if (filepath) {
      this.filepath = filepath;
      this.filename = getFileName(filepath);
    }

    const options = {
      filename: this.filename,
      filepath: this.filepath,
      bank: this.bank
    };

    const fileBase = this.filepath.split('.nesproj')[0];

    if (this.nametable) {
      options.nametable = this.nametable;
    } else {
      options.nametable = `${fileBase}.nam`;
      this.nametable = options.nametable;
      values.nametable.save(options.nametable);
    }

    if (this.tileset) {
      options.tileset = this.tileset;
    } else {
      options.tileset = `${fileBase}.chr`;
      this.tileset = options.tileset;
      values.tileset.save(options.tileset);
    }

    if (this.palettes) {
      options.palettes = this.palettes;
    } else {
      options.palettes = `${fileBase}.pal`;
      this.palettes = options.palettes;
      savePalettes(options.palettes, values.palettes);
    }

    fs.writeFile(this.filepath, JSON.stringify(options, null, 2), (err) => {
      if (err) { console.error(err); }
    });
    ipcRenderer.send('ALLOW_PROJECT_SAVE', true);
  },
  saveFiles: function (values) {
    values.nametable.save(this.nametable);
    values.tileset.save(this.tileset);
    savePalettes(this.palettes, values.palettes);
  }
};
