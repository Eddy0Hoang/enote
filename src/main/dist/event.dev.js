"use strict";

var _require = require('electron'),
    ipcMain = _require.ipcMain;

var fs = require('fs-extra');

var path = require('path');

var id = require('uuid').v3;

var md5 = require('crypto-js/md5');

!function () {
  if (!fs.existsSync(path.resolve('./data'))) {
    fs.mkdirSync(path.resolve('./data'));
  }
}();
/** 获取所有notes的文件名 */

ipcMain.on('get-notes', function (e) {
  e.returnValue = fs.readdirSync(path.resolve('./data'));
});
/** 通过note文件名获取内容 */

ipcMain.on('get-note', function (e, _id) {
  fs.readdirSync(path.resolve('./data')).forEach(function (v) {
    if (v.startsWith(_id)) {
      e.returnValue = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString());
      return;
    }
  });
  e.returnValue = {};
});
/** 创建note，文件名格式：id - 创建时间 - 名称base64 */

/** 任务列表taskList 格式{content: '内容', finished: false} */

ipcMain.on('create-note', function (e, name) {
  var filename = Date.now() + '-' + Buffer.from(name, 'utf-8').toString('base64');
  filename = md5(filename) + '-' + filename;
  fs.writeFileSync(path.resolve('./data', filename), JSON.stringify({
    name: name,
    html: '',
    files: [],
    md: '',
    taskList: []
  }));
  e.returnValue = fs.existsSync(path.resolve('./data', filename));
});
/** 修改note */

ipcMain.on('alter-note', function (e, _id, note) {
  fs.readdirSync(path.resolve('./data')).forEach(function (v) {
    if (v.startsWith(_id)) {
      var oldNote = JSON.parse(fs.readFileSync(path.resolve('./data/', v)).toString());
      var newNote = Object.assign(oldNote, note);
      fs.writeFileSync(path.resolve('./data/', v), JSON.stringify(newNote));
      e.returnValue = true;
      return;
    }
  });
  e.returnValue = false;
});
/** 删除note */

ipcMain.on('delete-note', function (e, _id) {
  fs.readdirSync(path.resolve('./data')).forEach(function (v) {
    if (v.startsWith(_id)) {
      fs.unlinkSync(path.resolve('./data/', v));
      e.returnValue = true;
      return;
    }
  });
  e.returnValue = false;
});