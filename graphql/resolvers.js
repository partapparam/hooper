const { GraphQLError } = require("graphql")
const User = require("../mongo/models/user")
const Game = require("../mongo/models/games")
// Publish Subscribe for subsciptions
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  Query: {
    PlayerAuth: async (root, args) => {
      console.log("here is auth", args.firebaseAuth)
      let user = await User.findOne({ firebaseAuth: args.firebaseAuth })
      return user
    },
    FindPlayer: (args) => User.findOne({ username: args.username }),
    GetAllPlayers: async () => {
      const users = await User.find()
      return users
    },
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
    UpdatePlayer: async (root, args, contextValue) => {
      console.log("updatePlayer")
      console.log(args)
      const user = await User.findOneAndUpdate(
        { firebaseAuth: contextValue.auth },
        {
          name: {
            first: args.first,
            last: args.last,
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
    CreateGame: async (root, args) => {
      console.log("creating game")
      const game = await new Game({ ...args })
      console.log(game)
      try {
        game.save()
      } catch (error) {
        throw new GraphQLError("Game was not created", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      return { code: 200, message: "success", success: true, game: game }
    },
  },
}

module.exports = resolvers
