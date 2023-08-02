const express = require("express")
const app = express()
const PORT = process.env.PORT || 3005
const http = require("http")
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
const typeDefs = require("./graphql/schema")
const resolvers = require("./graphql/resolvers")
const VerifyToken = require("./middleware/verifyToken")
const auth = require("./firebase/firebase.js")

require("dotenv").config()
// require("./postgres/pg")
require("./mongo/db")
require("./firebase/firebase")

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
// app.use(VerifyToken)

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

/**
 * For Subscriptions to be setup correctly, we setup the WebSocket Server with a function
 * When Queries and Mutations are made, it will use the HTTP server.
 */

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  // WSServer Object is registered to listen to WS connections, besides the usual HTTP connections
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    // this plugin is recommended to ensure the server shuts down correctly
    // Function will close WS connection on server shutdown
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })
  // The Graphql server has to start first, so we use Await
  await server.start()

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Set context by getting Firebase User ID. Use Firebase Admin SDK
        const header = req ? req.headers.authorization : null
        let currentUser = null
        if (header && header.startsWith("Bearer ")) {
          const token = header.split(" ")[1]
          const decodeValue = await auth.verifyIdToken(token)
          if (decodeValue) {
            currentUser = decodeValue.uid
          }
        }
        // CurrentUser will be available in the context for every resolver
        return { currentUser }
      },
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => {
    console.log("Server is now running at http://localhost:4000")
  })
}
start()
