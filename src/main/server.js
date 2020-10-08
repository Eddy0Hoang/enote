const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs-extra')
const multer = require('multer')
const path = require('path')

const app = new express()
const upload = multer({dest: 'img/'})
app.use(express.static(path.resolve('./img')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
})) 
!function () {
  if (!fs.existsSync('./img')) fs.mkdirSync('./img')
}()
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
})
app.post('/upload', upload.any(), (req, res) => {
  let files = []
  console.log(req)
  for (let file of req.files) {
    const newName = file.path + path.extname(file.originalname)
    fs.renameSync(file.path, newName)
    files.push(file.filename + path.extname(file.originalname))
  }
  res.send({
    errno: files.length > 0 ? 0: -1,
    data: files.map(v => 'http://localhost:9010/' + v)
  })
})

app.get('/', (req, res) => {
  res.send('hello world')
})
app.listen(9010, () => console.log('server in running at:localhost:9010'))