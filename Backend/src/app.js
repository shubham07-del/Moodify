const express = require("express")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.route")
const songRouter = require("./routes/song.route")
const cors = require("cors")



const app = express()
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
  "https://moodify-blush.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/songs", songRouter)



module.exports = app