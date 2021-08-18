const express = require('express')
const router = express.Router()
const passport = require('passport')
const { generateTokens, updateRefreshTokenInDB } = require('../helpers/tokens')

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const token = req.headers.authorization
      const newTokens = generateTokens(req.user._id)

      await updateRefreshTokenInDB(
        { refreshToken: token },
        newTokens.refreshToken,
        newTokens.refreshTokenExpiredAt
      )

      res.status(200).json(newTokens)
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || err || 'Something went wrong',
      })
    }
  }
)

module.exports = router
