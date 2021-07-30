const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../db-models/user')

const generateToken = (userId, type, expiresIn) =>
  jwt.sign({ userId, type }, config.get('jwt').secret, { expiresIn })

const generateTokens = (userId) => {
  const { access, refresh } = config.get('jwt').tokens
  const accessToken = generateToken(userId, access.type, access.expiresIn)

  const refreshToken = generateToken(userId, refresh.type, refresh.expiresIn)

  const accessTokenExpiredAt = Date.now() + access.expiresIn
  const refreshTokenExpiredAt = Date.now() + refresh.expiresIn

  return {
    accessToken,
    accessTokenExpiredAt,
    refreshToken,
    refreshTokenExpiredAt,
  }
}

const addDataTokenToUserObject = (currentUser, newTokens) => {
  currentUser.accessToken = `Bearer ${newTokens.accessToken}`
  currentUser.refreshToken = `Bearer ${newTokens.refreshToken}`

  currentUser.accessTokenExpiredAt = newTokens.accessTokenExpiredAt
  currentUser.refreshTokenExpiredAt = newTokens.refreshTokenExpiredAt
}

const updateRefreshTokenInDB = async (
  filter,
  refreshToken,
  refreshTokenExpiredAt
) => {
  await User.findOneAndUpdate(filter, {
    $set: {
      refreshToken,
      refreshTokenExpiredAt,
    },
  })
}

module.exports = {
  generateTokens,
  updateRefreshTokenInDB,
  addDataTokenToUserObject,
}
