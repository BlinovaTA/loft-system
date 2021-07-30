var express = require('express')
var router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../db-models/user')
const {
  generateTokens,
  updateRefreshTokenInDB,
  addDataTokenToUserObject,
} = require('../helpers/tokens')

router.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const currentUser = await User.findOne({ username })

    if (currentUser) {
      const result = bcrypt.compareSync(password, currentUser.password)

      if (result) {
        const newTokens = generateTokens(currentUser._id)

        await updateRefreshTokenInDB(
          { _id: currentUser._id },
          newTokens.refreshToken,
          newTokens.refreshTokenExpiredAt
        )
        addDataTokenToUserObject(currentUser, newTokens)

        currentUser.id = currentUser._id

        res.status(200).json(currentUser)
      } else {
        res.status(401).json({
          message: 'Invalid username or password',
        })
      }
    } else {
      res.status(404).json({
        message: 'User is not found. Register, please.',
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || err || 'Something went wrong',
    })
  }
})

module.exports = router
