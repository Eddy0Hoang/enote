const {
  ipcMain,
  dialog
} = require('electron')
const fs = require('fs-extra')
const path = require('path')
const md5 = require('crypto-js/md5')
const {
  exec
} = require('child_process')

  ! function () {
    if (!fs.existsSync(path.resolve('./data'))) {
      fs.mkdirSync(path.resolve('./data'))
    }
  }()
/** 获取所有notes的文件名 */
ipcMain.on('get-notes', e => {
  e.returnValue = fs.readdirSync(path.resolve('./data'))
})
/** 通过note文件名获取内容 */
ipcMain.on('get-note', (e, _id) => {
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      e.returnValue = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString())
      return
    }
  })
  e.returnValue = {}
})
/** 创建note，文件名格式：id - 创建时间 - 名称base64 */
/** 任务列表taskList 格式{content: '内容', finished: false} */
ipcMain.on('create-note', (e, name) => {
  let filename = Date.now() + '-' + Buffer.from(name, 'utf-8').toString('base64')
  filename = md5(filename) + '-' + filename + '.enote'
  fs.writeFileSync(path.resolve('./data', filename), JSON.stringify({
    name: name,
    html: '',
    files: [],
    md: '',
    tasks: []
  }))
  e.returnValue = fs.existsSync(path.resolve('./data', filename))
})
/** 修改note */
ipcMain.on('alter-note', (e, _id, note) => {
  console.log(_id, note)
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      let oldNote = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString())
      let newNote = Object.assign(oldNote, note)
      console.log(oldNote, newNote)
      fs.writeFileSync(path.resolve('./data/', v), JSON.stringify(newNote))
      e.returnValue = true
      return
    }
  })
  e.returnValue = false
})
/** 删除note */
ipcMain.on('delete-note', (e, _id) => {
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      fs.unlinkSync(path.resolve('./data/', v))
      e.returnValue = true
      return
    }
  })
  e.returnValue = false
})
ipcMain.on('add-files', (e, _id, absPaths) => {
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      let oldNote = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString())
      let items = absPaths.map(v => ({
        id: md5(v) + '',
        absPath: v,
        name: path.basename(v)
      }))
      let newItems = items.filter(v =>
        oldNote.files.find(item => item.absPath === v.absPath) == undefined
      )
      oldNote.files.push(...newItems)
      fs.writeFileSync(path.resolve('./data/', v), JSON.stringify(oldNote))
      e.returnValue = {
        ok: true,
        msg: newItems.length === items.length ? '已全部添加' : '存在部分重复文件，已筛除'
      }
      return
    }
  })
  e.returnValue = {
    ok: false,
    msg: '添加失败'
  }
})
ipcMain.on('delete-file', (e, _id, fileId) => {
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      let oldNote = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString())
      let newItems = oldNote.files.filter(v =>
        fileId != v.id
      )
      let flag = oldNote.files.length != newItems.length
      oldNote.files = newItems
      fs.writeFileSync(path.resolve('./data/', v), JSON.stringify(oldNote))
      e.returnValue = {
        ok: flag,
        msg: flag ? '已删除' : '未找到'
      }
      return
    }
  })
  e.returnValue = {
    ok: false,
    msg: '删除失败'
  }
})
ipcMain.on('set-mark', (e, _id, fileId, mark) => {
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      let oldNote = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString())
      let i = oldNote.files.findIndex(v => v.id === fileId)
      if (i < 0) {
        e.returnValue = {
          ok: false,
          msg: '未找到'
        }
        return
      }
      oldNote.files[i].mark = mark
      fs.writeFileSync(path.resolve('./data/', v), JSON.stringify(oldNote))
      e.returnValue = {
        ok: true,
        msg: '完成'
      }
      return
    }
  })
  e.returnValue = {
    ok: false,
    msg: '删除失败'
  }
})
ipcMain.on('add-task', (e, _id, taskContent) => {
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      let oldNote = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString())
      let item = {
        id: md5(taskContent + Date.now()) + '',
        finished: false,
        content: taskContent,
        time: Date.now()
      }
      if (!oldNote.tasks) oldNote.tasks = []
      oldNote.tasks.push(item)
      fs.writeFileSync(path.resolve('./data/', v), JSON.stringify(oldNote))
      e.returnValue = {
        ok: true,
        msg: '添加任务成功'
      }
      return
    }
  })
  e.returnValue = {
    ok: false,
    msg: '添加失败'
  }
})
ipcMain.on('finish-task', (e, _id, taskId) => {
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      let oldNote = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString())
      for (let o of oldNote.tasks) {
        if (o.id === taskId) {
          o.finished = !o.finished
        }
      }
      fs.writeFileSync(path.resolve('./data/', v), JSON.stringify(oldNote))
      e.returnValue = {
        ok: true,
        msg: ''
      }
      return
    }
  })
  e.returnValue = {
    ok: false,
    msg: ''
  }
})
ipcMain.on('delete-task', (e, _id, taskId) => {
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      let oldNote = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString())
      let newItems = oldNote.tasks.filter(v =>
        taskId != v.id
      )
      let flag = oldNote.tasks.length != newItems.length
      oldNote.tasks = newItems
      fs.writeFileSync(path.resolve('./data/', v), JSON.stringify(oldNote))
      console.log('falg:', flag)
      e.returnValue = {
        ok: flag,
        msg: flag ? '已删除' : '未找到'
      }
      return
    }
  })
  e.returnValue = {
    ok: false,
    msg: '删除失败'
  }
})
ipcMain.on('alter-task', (e, _id, taskId, content) => {
  fs.readdirSync(path.resolve('./data')).forEach(v => {
    if (v.startsWith(_id)) {
      let oldNote = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString())
      let i = oldNote.tasks.findIndex(v =>
        taskId === v.id
      )
      if (i < 0) {
        e.returnValue = {
          ok: false,
          msg: '未找到'
        }
        return
      }
      oldNote.tasks[i].content = content
      fs.writeFileSync(path.resolve('./data/', v), JSON.stringify(oldNote))
      e.returnValue = {
        ok: true,
        msg: '已更改'
      }
      return
    }
  })
  e.returnValue = {
    ok: false,
    msg: '删除失败'
  }
})
ipcMain.on('select-files', e => {
  dialog.showOpenDialog(null, {
    properties: ['openFile', 'multiSelections']
  }).then(res => {
    e.returnValue = res
  }).catch(err => console.error(err))
})
ipcMain.on('open-file', (e, filename) => {
  let cmd = ' ' + filename
  if (process.platform === 'win32') {
    cmd = 'start ' + cmd
  } else if (process.platform === 'linux') {
    cmd = 'xdg-open ' + cmd
  } else if (process.platform === 'darwin') {
    cmd = 'open ' + cmd
  } else {
    e.returnValue = false
    return
  }
  exec(cmd)
  e.returnValue = true
})
ipcMain.on('import-file', e => {
  dialog.showOpenDialog(null, {
      properties: ['openFile'],
      filter: [{
        name: 'enote Files',
        extensions: ['enote']
      }]
    }).then(res => {
      if (res.canceled) {
        e.returnValue = null
        return
      }
      let filepath = res.filePaths[0]
      let json = fs.readFileSync(filepath).toString()
      let note = new Object()
      try {
        note = JSON.parse(json)
      } catch (err) {
        e.returnValue = null
        return
      }
      e.returnValue = note.name ? Object.assign({
        html: '',
        files: [],
        tasks: []
      }, note) : null
    })
    .catch(err => console.log(err))
})
let maxFlag = false
ipcMain.on('window-cmd', (e, cmd) => {
  let mainWindow = global.mainWindow
  if (cmd === 'minimize') {
    mainWindow.minimize()
  } else if (cmd === 'maximize') {
    if (maxFlag) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
    maxFlag = !maxFlag
  } else if (cmd === 'exit') {
    mainWindow.close()
  } else if (cmd === 'open-dev-tool') {
    mainWindow.toggleDevTools()
  }
})