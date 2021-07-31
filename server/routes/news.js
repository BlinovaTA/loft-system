const express = require('express')
const router = express.Router()
const passport = require('passport')
const News = require('../db-models/news')

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const allNews = await News.aggregate([
        {
          $project: {
            _id: 0,
            id: '$_id',
            created_at: 1,
            title: 1,
            text: 1,
            user: 1,
          },
        },
      ])

      res.status(200).json(allNews)
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
      console.log(req.body)
      console.log(req.user)
      const { text, title } = req.body
      const user = req.user

      await new News({
        text,
        title,
        user,
      }).save()

      const allNews = await News.aggregate([
        {
          $project: {
            _id: 0,
            id: '$_id',
            created_at: 1,
            title: 1,
            text: 1,
            user: 1,
          },
        },
      ])

      res.status(201).json(allNews)
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || err || 'Something went wrong',
      })
    }
  }
)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await News.remove({ _id: req.params.id })

      const allNews = await News.aggregate([
        {
          $project: {
            _id: 0,
            id: '$_id',
            created_at: 1,
            title: 1,
            text: 1,
            user: 1,
          },
        },
      ])

      res.status(201).json(allNews)
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || err || 'Something went wrong',
      })
    }
  }
)

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await News.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      )

      const allNews = await News.aggregate([
        {
          $project: {
            _id: 0,
            id: '$_id',
            created_at: 1,
            title: 1,
            text: 1,
            user: 1,
          },
        },
      ])

      res.status(201).json(allNews)
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || err || 'Something went wrong',
      })
    }
  }
)

module.exports = router
