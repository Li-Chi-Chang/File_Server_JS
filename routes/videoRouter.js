let express = require('express')
let router = express.Router()
let path = require('path')

let video_controller = require('../controller/videoController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

router.get('/:videoid/', video_controller.videoShowPage)

router.get(path.join('/:videoid/',process.env.videoPosterUrl), video_controller.videoShowPoster)

router.get(path.join('/:videoid/',process.env.videoViewUrl), video_controller.videoShowVideo)

router.post('/:videoid/', video_controller.videoDelete)

module.exports = router