require("dotenv").config()
const dns = require("dns")
dns.setServers(["8.8.8.8"], ["1.1.1.1"])

const connectToDB = require("./src/config/database")
connectToDB()

const app = require("./src/app")


app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})