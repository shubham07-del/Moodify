const express = require("express")
const songController = require("../controllers/songs.controller")
const upload = require("../middlewares/upload.middleware")


const songRouter = express.Router()

songRouter.post("/", upload.single("song"),songController.uploadSongController)
songRouter.get("/", songController.getSong)

module.exports = songRouter