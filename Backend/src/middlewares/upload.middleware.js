const multer = require("multer")

const storage = multer.memoryStorage()

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024 * 1024 * 15 // max 5mb file can be upload
    }
})

module.exports = upload