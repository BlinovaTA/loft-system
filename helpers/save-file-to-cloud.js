const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: '',
  api_key: '',
  api_secret: '',
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
