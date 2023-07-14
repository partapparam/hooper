const express = require("express")
const app = express()
const PORT = process.env.PORT || 3005
const morgan = require("morgan")
const helmet = require("helmet")
const cors = require("cors")
const { ApolloServer } = require("@apollo/server")
const { GraphQLError } = require("graphql")
const { expressMiddleware } = require("@apollo/server/express4")
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer")
const { makeExecutableSchema } = require("@graphql-tools/schema")
const { WebSocketServer } = require("ws")
const { useServer } = require("graphql-ws/lib/use/ws")

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
