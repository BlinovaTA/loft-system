const multer = require('multer')
const format = require('date-fns/format')
const fs = require('fs/promises')

const storage = multer.diskStorage({
  async destination(req, file, cb) {
    await fs.mkdir('./upload', { recursive: true })
    cb(null, './upload')
  },
  filename(req, file, cb) {
    const date = format(new Date(), 'ddMMyyyy-HHmmss_SSS')
    cb(null, `${date}-${file.originalname}`)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const limits = { fileSize: 1024 * 1024 }

module.exports = multer({ storage, fileFilter, limits })
