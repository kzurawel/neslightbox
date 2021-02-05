// const path = require('path');
// const fs = require('fs');

function Project (options) {
  this.filename = options.filename;
  this.filepath = options.filepath;
  this.title = options.title;
  this.nametable = options.nametable ? options.nametable : options.title;
  this.tileset = options.tileset ? options.tileset : options.title;
  this.palettes = options.palettes ? options.palettes : options.palettes;
  this.bank = options.bank ? options.bank : 0;
}
exports.Project = Project;

Project.prototype = {
  load: function () {

  },
  save: function () {

  }
};
