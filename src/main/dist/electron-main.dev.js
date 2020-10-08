"use strict";

var _require = require('electron'),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow;

var path = require('path');

var url = require('url');

var _require2 = require('process'),
    exit = _require2.exit;

var mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });
  global.mainId = mainWindow.id;
  global.mainWindow = mainWindow;
  var startUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    return mainWindow = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    console.log('window all closed');
    app.quit();
    exit();
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});