const { GraphQLError } = require("graphql")
const User = require("../mongo/models/user")
const Game = require("../mongo/models/games")
// Publish Subscribe for subsciptions
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  Query: {
    playerAuth: (args) => User.findOne({ firebaseAuth: args.firebaseAuth }),
    findPlayer: (args) => User.findOne({ username: args.username }),
  },
  Mutation: {
    createPlayer: async (root, args) => {
      console.log("creating user called", args.firebaseAuth)
      const user = await new User({ firebaseAuth: args.firebaseAuth })
      try {
        user.save()
      } catch (error) {
        throw new GraphQLError("User not created, firebase missing", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        })
      }
      return user
    },
  },
}
