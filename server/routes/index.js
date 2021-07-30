const express = require('express')
const router = express.Router()

router.use('/login', require('./login'))

router.use('/registration', require('./registration'))

module.exports = router
