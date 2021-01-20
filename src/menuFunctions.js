const { dialog } = require('electron');
const fs = require('fs');

function onOpenProject (item, focusedWindow) {

}
exports.onOpenProject = onOpenProject;

function onSaveProjectAs (item, focusedWindow) {

}
exports.onSaveProjectAs = onSaveProjectAs;

function onRemoveDuplicates (item, focusedWindow) {

}
exports.onRemoveDuplicates = onRemoveDuplicates;

function onRemoveUnused (item, focusedWindow) {

}
exports.onRemoveUnused = onRemoveUnused;

function onOpenNametable (item, focusedWindow) {

}
exports.onOpenNametable = onOpenNametable;

function onSaveNametableAs (item, focusedWindow) {

}
exports.onSaveNametableAs = onSaveNametableAs;

function onSaveAllNametables (item, focusedWindow) {

}
exports.onSaveAllNametables = onSaveAllNametables;

function onOpenChr (item, focusedWindow) {
  dialog.showOpenDialog(focusedWindow, {
    title: 'Open a CHR file',
    properties: ['openFile'],
    filters: [
      { name: 'CHR files', extensions: ['chr'] },
      { name: 'All files', extensions: ['*'] }
    ]
  }).then((fileObj) => {
    if (!fileObj.canceled) {
      fs.readFile(fileObj.filePaths[0], (err, fileData) => {
        if (err) { throw new Error(err); }
        focusedWindow.webContents.send('CHR_OPEN', {
          data: Buffer.from(fileData),
          path: fileObj.filePaths[0]
        });
      });
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onOpenChr = onOpenChr;

function onSaveChrAs (item, focusedWindow) {

}
exports.onSaveChrAs = onSaveChrAs;

function onSaveChr (item, focusedWindow) {

}
exports.onSaveChr = onSaveChr;
