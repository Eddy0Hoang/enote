const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const { exit } = require('process')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 350,
    frame: false,
    transparent: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })
  global.mainId = mainWindow.id
  global.mainWindow = mainWindow
  const startUrl = process.env.NODE_ENV === 'development' ?
    'http://localhost:3000' : url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true
    });
  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log('window all closed')
    app.quit()
    exit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})