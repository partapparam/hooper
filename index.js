const express = require("express")
const app = express()
const PORT = process.env.PORT || 3005
const morgan = require("morgan")
const helmet = require("helmet")
const cors = require("cors")

require("dotenv").config()
// require("./postgres/pg")
require("./mongo/db")
require("./firebase/firebase")

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

app.get("/", (req, res) => {
  return res.json({ message: "success", data: "You are getting data" })
})

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`)
})
