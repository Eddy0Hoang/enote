"use strict";

var electron = require('electron');

var url = require('url');

var path = require('path');

var BrowserWindow = electron.BrowserWindow,
    Menu = electron.Menu,
    app = electron.app; // const package = require(path.resolve(__dirname, '../package.json'))

var menuTemplate = [{
  label: 'Tools',
  submenu: [{
    label: 'open devTools',
    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
    click: function click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  }, {
    label: 'reload',
    accelerator: 'CmdOrCtrl+R',
    click: function click(item, focusedWindow) {
      if (focusedWindow) {
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(function (window) {
            if (window.id > 1) {
              window.close();
            }
          });
        }

        focusedWindow.reload();
      }
    }
  }, {
    label: 'reopen',
    click: function click(item, focusedWindow) {
      app.emit('activate');
    }
  }]
}, {
  label: 'File',
  submenu: [{
    label: 'Save',
    accelerator: 'CmdOrCtrl+S',
    click: function click(item, focusedWindow) {
      focusedWindow.webContents.send('save');
    }
  }]
}];
app.on('ready', function () {
  var menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});