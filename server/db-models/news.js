const { Schema, model, Types } = require('mongoose')

const newsSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now(),
  },
  text: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  user: {
    _id: {
      type: Types.ObjectId,
      ref: 'users',
    },
  },
})

module.exports = model('news', newsSchema)
