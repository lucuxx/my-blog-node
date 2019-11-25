const express = require('express')
const app = express()
const http = require('http')
const bodyParser = require('body-parser')
// 引入写好的api接口
const user = require('./interface/user')
const article = require('./interface/article')
const articleClass = require('./interface/articleClass')
const articleTags = require('./interface/articleTags')
const comment = require('./interface/comment')

const cookieParser = require('cookie-parser')
app.use(bodyParser.json({ limit: '2100000kb' }))
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(cookieParser())
app.use(user)
app.use(article)
app.use(articleClass)
app.use(articleTags)
app.use(comment)

http.createServer(app).listen(3000, () => {
  console.log('服务器已开启')
})
