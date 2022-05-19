let express = require('express')
let router = express.Router()

let gallery_controller = require('../controller/galleryController')

router.get('/:galleryid/', gallery_controller.galleryShow)
router.get('/:galleryid/:imgid', gallery_controller.galleryShowSingleImg)

router.post('/:galleryid', gallery_controller.galleryDelete)

module.exports = router
