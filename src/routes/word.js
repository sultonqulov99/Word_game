const controller = require('../controllers/word.js')
const router = require('express').Router()

router.get('/word', controller.GET)

module.exports = router