const express = require('express')
const router = express.Router()
const User = require('../db-models/user')

router.delete('/:id', async (req, res) => {
  try {
    await User.remove({ _id: req.params.id })

    res.status(200).json({
      message: 'User deleted',
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || err || 'Something went wrong',
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const allUsers = await User.aggregate([
      {
        $project: {
          _id: 0,
          id: '$_id',
          password: 1,
          firstName: 1,
          middleName: 1,
          permission: 1,
          surName: 1,
          username: 1,
          accessToken: 1,
          refreshToken: 1,
          accessTokenExpiredAt: 1,
          refreshTokenExpiredAt: 1,
          image: 1
        },
      },
    ])

    res.status(200).json(allUsers)
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || err || 'Something went wrong',
    })
  }
})

router.patch('/:id/permission', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    )

    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || err || 'Something went wrong',
    })
  }
})

module.exports = router
