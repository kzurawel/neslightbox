const { dialog } = require('electron');
const fs = require('fs');

const { getFileName } = require('./utils/files.js');

function onOpenProject (item, focusedWindow) {
  dialog.showOpenDialog(focusedWindow, {
    title: 'Open a project',
    properties: ['openFile'],
    filters: [
      { name: 'Project files', extensions: ['nesproj'] },
      { name: 'All files', extensions: ['*'] }
    ]
  }).then((fileObj) => {
    if (!fileObj.canceled) {
      fs.readFile(fileObj.filePaths[0], 'utf8', (err, fileData) => {
        if (err) { throw new Error(err); }
        const filename = getFileName(fileObj.filePaths[0]);
        const options = JSON.parse(fileData);
        options.filepath = fileObj.filePaths[0];
        options.filename = filename;

        focusedWindow.webContents.send('PROJECT_OPEN', {
          options
        });
      });
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onOpenProject = onOpenProject;

function onSaveProjectAs (item, focusedWindow) {
  dialog.showSaveDialog(focusedWindow, {
    title: 'Save project settings',
    properties: ['createDirectory'],
    filters: [
      { name: 'Project files', extensions: ['nesproj'] },
      { name: 'All files', extensions: ['*'] }
    ]
  }).then((fileObj) => {
    if (!fileObj.canceled) {
      const filename = getFileName(fileObj.filePath);
      focusedWindow.webContents.send('PROJECT_SAVE_AS', {
        file: fileObj,
        filename: filename
      });
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onSaveProjectAs = onSaveProjectAs;

function onSaveProjectFiles (item, focusedWindow) {
  focusedWindow.webContents.send('PROJECT_SAVE_FILES');
}
exports.onSaveProjectFiles = onSaveProjectFiles;

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
        const filename = getFileName(fileObj.filePaths[0]);
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
      const filename = getFileName(fileObj.filePath);
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
        const filename = getFileName(fileObj.filePaths[0]);
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
      const filename = getFileName(fileObj.filePath);
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
  dialog.showOpenDialog(focusedWindow, {
    title: 'Open a palettes file',
    properties: ['openFile'],
    filters: [
      { name: 'Palette files', extensions: ['pal'] },
      { name: 'All files', extensions: ['*'] }
    ]
  }).then((fileObj) => {
    if (!fileObj.canceled) {
      fs.readFile(fileObj.filePaths[0], (err, fileData) => {
        if (err) { throw new Error(err); }
        const filename = getFileName(fileObj.filePaths[0]);
        focusedWindow.webContents.send('PALETTES_OPEN', {
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
exports.onOpenPalettes = onOpenPalettes;

function onSavePalettesAs (item, focusedWindow) {
  dialog.showSaveDialog(focusedWindow, {
    title: 'Save palettes file',
    properties: ['createDirectory'],
    filters: [
      { name: 'Palette files', extensions: ['pal'] },
      { name: 'All files', extensions: ['*'] }
    ]
  }).then((fileObj) => {
    if (!fileObj.canceled) {
      const filename = getFileName(fileObj.filePath);
      focusedWindow.webContents.send('PALETTES_SAVE_AS', {
        file: fileObj,
        filename: filename
      });
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onSavePalettesAs = onSavePalettesAs;

function onSavePalettes (item, focusedWindow) {
  dialog.showMessageBox(focusedWindow, {
    type: 'warning',
    title: 'Overwrite palettes file?',
    message: 'This will overwrite the existing palettes file. This action cannot be undone. Do you want to proceed?',
    buttons: ['Save', 'Cancel'],
    cancelId: 1,
    defaultId: 0
  }).then((res) => {
    if (res.response === 0) {
      focusedWindow.webContents.send('PALETTES_SAVE');
    }
  }).catch((e) => {
    console.error(e);
  });
}
exports.onSavePalettes = onSavePalettes;
