const controller = require('../controllers/start.js')
const router = require('express').Router()

router.get('/start', controller.GET)

module.exports = router