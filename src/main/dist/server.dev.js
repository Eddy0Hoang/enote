"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var fs = require('fs-extra');

var multer = require('multer');

var path = require('path');

var app = new express();
var upload = multer({
  dest: 'img/'
});
app.use(express["static"](path.resolve('./img')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
!function () {
  if (!fs.existsSync('./img')) fs.mkdirSync('./img');
}();
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
app.post('/upload', upload.any(), function (req, res) {
  var files = [];
  console.log(req);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = req.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var file = _step.value;
      var newName = file.path + path.extname(file.originalname);
      fs.renameSync(file.path, newName);
      files.push(file.filename + path.extname(file.originalname));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  res.send({
    errno: files.length > 0 ? 0 : -1,
    data: files.map(function (v) {
      return 'http://localhost:9010/' + v;
    })
  });
});
app.get('/', function (req, res) {
  res.send('hello world');
});
app.listen(9010, function () {
  return console.log('server in running at:localhost:9010');
});