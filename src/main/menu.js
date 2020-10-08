const electron = require('electron')
const url = require('url')
const path = require('path')

const { BrowserWindow, Menu,app } = electron
// const package = require(path.resolve(__dirname, '../package.json'))

let menuTemplate = [
  {
    label: 'Tools',
    submenu: [
      {
        label: 'open devTools',
        accelerator: process.platform === 'darwin' ? 
                'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools()
          }
        }
      }, {
        label: 'reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) {
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(window => {
                if (window.id > 1) {
                  window.close()
                }
              })
            }
            focusedWindow.reload()
          }
        }
      }, {
        label: 'reopen',
        click(item, focusedWindow) {
          app.emit('activate')
        }
      }
    ]
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('save')
        }
      }
    ]
  }
]

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})