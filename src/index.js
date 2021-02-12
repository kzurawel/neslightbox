const { app, ipcMain, Menu } = require('electron');
const RatioWindow = require('./utils/ratiowindow.js');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new RatioWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', app.quit);

// Disable save (not save as) when no file is loaded
ipcMain.on('ALLOW_CHR_SAVE', (e, allow) => {
  Menu.getApplicationMenu().getMenuItemById('saveCHR').enabled = allow;
});
ipcMain.on('ALLOW_NAMETABLE_SAVE', (e, allow) => {
  Menu.getApplicationMenu().getMenuItemById('saveNametable').enabled = allow;
});
ipcMain.on('ALLOW_PALETTES_SAVE', (e, allow) => {
  Menu.getApplicationMenu().getMenuItemById('savePalettes').enabled = allow;
});
ipcMain.on('ALLOW_PROJECT_SAVE', (e, allow) => {
  Menu.getApplicationMenu().getMenuItemById('saveProjectFiles').enabled = allow;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
require('./menu.js');
