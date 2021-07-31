const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../db-models/user')

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { user } = req

      user.id = user._id

      res.status(200).json(user)
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || err || 'Something went wrong',
      })
    }
  }
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = req.user
      const { firstName, middleName, surName, oldPassword, newPassword } =
        req.body
      const result = bcrypt.compareSync(oldPassword, user.password)

      if (!result) {
        res.status(400).json({
          message: 'Incorrect password entered.',
        })
      } else {
        const hashedPassword = newPassword
          ? await bcrypt.hash(newPassword, 12)
          : user.password

        const objectToUpdate = {
          password: hashedPassword,
          firstName,
          middleName,
          surName,
        }

        const updateUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: objectToUpdate },
          { new: true }
        )

        updateUser.id = updateUser._id

        console.log(updateUser)

        res.status(200).json(updateUser)
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || err || 'Something went wrong',
      })
    }
  }
)

module.exports = router
