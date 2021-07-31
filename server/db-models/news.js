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
    firstName: {
      type: String,
    },
    _id: {
      type: Types.ObjectId,
      ref: 'users',
    },
    middleName: {
      type: String,
      required: true,
    },
    surName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    image: String,
  },
})

module.exports = model('news', newsSchema)
