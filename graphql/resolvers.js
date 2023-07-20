const { GraphQLError } = require("graphql")
const User = require("../mongo/models/user")
const Game = require("../mongo/models/games")
// Publish Subscribe for subsciptions
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  Query: {
    PlayerAuth: (args) => User.findOne({ firebaseAuth: args.firebaseAuth }),
    FindPlayer: (args) => User.findOne({ username: args.username }),
  },
  Mutation: {
    CreatePlayer: async (root, args) => {
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
      return { code: 200, message: "success", success: true, player: user }
    },
    UpdatePlayer: async (root, args) => {
      console.log("updatePlayer")
      console.log(args)
      const user = await User.findOneAndUpdate(
        { firebaseAuth: args.firebaseAuth },
        {
          name: {
            first: args.firstName,
            last: args.lastName,
          },
          username: args.username,
          location: args.location,
        },
        { new: true }
      )
      console.log(user)
      // setting New option to True will return the document after update was applied
      return {
        code: 200,
        message: "see what happens",
        success: true,
        player: user,
      }
    },
  },
}

module.exports = resolvers
