const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.use('/login', require('./login'))
router.use('/registration', require('./registration'))
router.use('/refresh-token', require('./refresh-token'))
router.use('/profile', bodyParser.text(), require('./profile'))
router.use('/news', require('./news'))
router.use('/users', require('./users'))

module.exports = router
