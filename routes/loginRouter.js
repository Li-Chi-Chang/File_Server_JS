let express = require('express')
let router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.cookies.username && req.cookies.password)
    res.send('login already')
  else
    res.render('login',{actionpath:process.env.loginUrl})
})

router.post('/', function(req, res, next) {
  if(req.body.username && req.body.password)
  {
    res.cookie(process.env.loginUser,req.body.username,{maxAge:process.env.loginAlive})
    res.cookie(process.env.loginPass,req.body.password,{maxAge:process.env.loginAlive})
    res.redirect(process.env.dirUrl)
  }
  else{
    res.render('login',{actionpath:process.env.loginUrl})
  }
})

router.get('/out', function(req, res, next) {
  res.clearCookie(process.env.loginUser)
  res.clearCookie(process.env.loginPass)
  res.redirect(process.env.dirUrl)
})

module.exports = router