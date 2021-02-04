const { app, Menu } = require('electron');

const menuFns = require('./menuFunctions.js');

const isMac = process.platform === 'darwin';

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'separator', visible: false } : { role: 'quit' },
      {
        label: 'Open Project...',
        click: menuFns.onOpenProject
      },
      {
        label: 'Save Project As...',
        click: menuFns.onSaveProjectAs
      }
    ]
  },
  // {
  //   label: 'Optimizations',
  //   submenu: [
  //     {
  //       label: 'Remove Duplicates',
  //       click: menuFns.onRemoveDuplicates
  //     },
  //     {
  //       label: 'Remove Unused',
  //       click: menuFns.onRemoveUnused
  //     }
  //   ]
  // },
  {
    label: 'Nametables',
    submenu: [
      {
        label: 'Open Nametable...',
        click: menuFns.onOpenNametable
      },
      {
        label: 'Save Nametable As...',
        click: menuFns.onSaveNametableAs
      },
      {
        label: 'Save Nametable',
        click: menuFns.onSaveNametable,
        id: 'saveNametable'
      }
    ]
  },
  {
    label: 'Tilesets',
    submenu: [
      {
        label: 'Open CHR...',
        click: menuFns.onOpenChr
      },
      {
        label: 'Save CHR As...',
        click: menuFns.onSaveChrAs
      },
      {
        label: 'Save CHR',
        click: menuFns.onSaveChr,
        id: 'saveCHR'
      }
    ]
  },
  {
    label: 'Palettes',
    submenu: [
      {
        label: 'Open Palettes...',
        click: menuFns.onOpenPalettes
      },
      {
        label: 'Save Palettes As...',
        click: menuFns.onSavePalettesAs
      },
      {
        label: 'Save Palettes',
        click: menuFns.onSavePalettes
      }
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
        : [
            { role: 'close' }
          ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org');
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
