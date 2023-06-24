const mongoose = require("mongoose")

if (!process.env.MONGO_DB) {
  console.log("no connection string for mongo db")
  process.exit(-1)
}

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true })
const db = mongoose.connection
db.on("error", (err) => {
  console.log("Error with mongo db")
  process.exit(-1)
})

db.once("open", () => {
  console.log("mongo db is opne")
})

module.exports = db
