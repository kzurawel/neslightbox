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
  dialog.showOpenDialog(focusedWindow, {
    title: 'Open a nametable',
    properties: ['openFile'],
    filters: [
      { name: 'Nametable files', extensions: ['nam'] },
      { name: 'All files', extensions: ['*'] }
    ]
  }).then((fileObj) => {
    if (!fileObj.canceled) {
      fs.readFile(fileObj.filePaths[0], (err, fileData) => {
        if (err) { throw new Error(err); }
        let filenameParts = fileObj.filePaths[0].split('/');
        filenameParts = filenameParts[filenameParts.length - 1].split('\\');
        const filename = filenameParts[filenameParts.length - 1];
        focusedWindow.webContents.send('NAMETABLE_OPEN', {
          data: Buffer.from(fileData),
          path: fileObj.filePaths[0],
          file: filename
        });
      });
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onOpenNametable = onOpenNametable;

function onSaveNametableAs (item, focusedWindow) {
  dialog.showSaveDialog(focusedWindow, {
    title: 'Save nametable',
    properties: ['createDirectory'],
    filters: [
      { name: 'Nametable files', extensions: ['nam'] },
      { name: 'All files', extensions: ['*'] }
    ]
  }).then((fileObj) => {
    if (!fileObj.canceled) {
      let filenameParts = fileObj.filePath.split('/');
      filenameParts = filenameParts[filenameParts.length - 1].split('\\');
      const filename = filenameParts[filenameParts.length - 1];
      focusedWindow.webContents.send('NAMETABLE_SAVE_AS', {
        file: fileObj,
        filename: filename
      });
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onSaveNametableAs = onSaveNametableAs;

function onSaveNametable (item, focusedWindow) {
  dialog.showMessageBox(focusedWindow, {
    type: 'warning',
    title: 'Overwrite nametable?',
    message: 'This will overwrite the existing nametable file. This action cannot be undone. Do you want to proceed?',
    buttons: ['Save', 'Cancel'],
    cancelId: 1,
    defaultId: 0
  }).then((res) => {
    if (res.response === 0) {
      focusedWindow.webContents.send('NAMETABLE_SAVE');
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onSaveNametable = onSaveNametable;

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
        let filenameParts = fileObj.filePaths[0].split('/');
        filenameParts = filenameParts[filenameParts.length - 1].split('\\');
        const filename = filenameParts[filenameParts.length - 1];
        focusedWindow.webContents.send('CHR_OPEN', {
          data: Buffer.from(fileData),
          path: fileObj.filePaths[0],
          file: filename
        });
      });
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onOpenChr = onOpenChr;

function onSaveChrAs (item, focusedWindow) {
  dialog.showSaveDialog(focusedWindow, {
    title: 'Save CHR file',
    properties: ['createDirectory'],
    filters: [
      { name: 'CHR files', extensions: ['chr'] },
      { name: 'All files', extensions: ['*'] }
    ]
  }).then((fileObj) => {
    if (!fileObj.canceled) {
      let filenameParts = fileObj.filePath.split('/');
      filenameParts = filenameParts[filenameParts.length - 1].split('\\');
      const filename = filenameParts[filenameParts.length - 1];
      focusedWindow.webContents.send('CHR_SAVE_AS', {
        file: fileObj,
        filename: filename
      });
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onSaveChrAs = onSaveChrAs;

function onSaveChr (item, focusedWindow) {
  dialog.showMessageBox(focusedWindow, {
    type: 'warning',
    title: 'Overwrite CHR file?',
    message: 'This will overwrite the existing CHR file. This action cannot be undone. Do you want to proceed?',
    buttons: ['Save', 'Cancel'],
    cancelId: 1,
    defaultId: 0
  }).then((res) => {
    if (res.response === 0) {
      focusedWindow.webContents.send('CHR_SAVE');
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onSaveChr = onSaveChr;

function onOpenPalettes (item, focusedWindow) {

}
exports.onOpenPalettes = onOpenPalettes;

function onSavePalettesAs (item, focusedWindow) {

}
exports.onSavePalettesAs = onSavePalettesAs;

function onSavePalettes (item, focusedWindow) {

}
exports.onSavePalettes = onSavePalettes;
