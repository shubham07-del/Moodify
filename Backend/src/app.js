const express = require("express")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.route")
const songRouter = require("./routes/song.route")
const cors = require("cors")



const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://moodify-blush.vercel.app",
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/songs", songRouter)



module.exports = app