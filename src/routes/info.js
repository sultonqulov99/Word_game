const controller = require('../controllers/info.js')
const router = require('express').Router()

router.get('/info', controller.GET)

module.exports = router