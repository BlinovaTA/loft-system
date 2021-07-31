const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: 'dwulah4ge',
  api_key: '677944659291834',
  api_secret: 'l5s32xXTJtx2-KkTMAEXOctNHU8',
})

module.exports = async (file, res) => {
  try {
    return await cloudinary.uploader.upload(file, {
      transformation: [{ width: 380, height: 380, crop: 'thumb' }],
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || err || 'Something went wrong',
    })
  }
}
