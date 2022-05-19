let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
require('dotenv').config()

let mongoose = require('mongoose')
mongoose.connect(process.env.mongodbPath)

let indexRouter = require('./routes/index')
let loginRouter = require('./routes/loginRouter')
let dirRouter = require('./routes/dirRouter')
let novelRouter = require('./routes/novelRouter')
let galleryRouter = require('./routes/galleryRouter')
let videoRouter = require('./routes/videoRouter')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use(process.env.loginUrl, loginRouter)
app.use(process.env.dirUrl, dirRouter)
app.use(process.env.novelUrl, novelRouter)
app.use(process.env.galleryUrl,galleryRouter)
app.use(process.env.videoUrl,videoRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', {title: 'ERROR'})
})

module.exports = app