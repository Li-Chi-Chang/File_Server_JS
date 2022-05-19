let express = require('express')
let router = express.Router()

let dir_controller = require('../controller/dirController')

/* GET dir. */
router.get('/', dir_controller.dirShowRoot)

router.get('/:id', dir_controller.dirShow)

router.post('/:id', dir_controller.dirCreateDeleteUpdate)

module.exports = router
