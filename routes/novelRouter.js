let express = require('express')
let router = express.Router()

let novel_controller = require('../controller/novelController')

router.get('/:novelid/', novel_controller.novelShow)
router.get('/:novelid/:pageid', novel_controller.novelRead)

router.post('/:novelid', novel_controller.novelDelete)

module.exports = router
