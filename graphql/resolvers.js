const { GraphQLError } = require("graphql")
const Player = require("../mongo/models/player")
const Game = require("../mongo/models/games")
// Publish Subscribe for subsciptions
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  // Resolver for nested Objects
  Game: {
    homeTeam(parent, args) {
      console.log("finding the hometeam")
      return parent.homeTeam.map((id) => {
        return Player.findOne({ _id: id })
      })
    },
    awayTeam(parent, args) {
      console.log("finding the awayteam")
      return parent.homeTeam.map((id) => {
        return Player.findOne({ _id: id })
      })
    },
  },
  Query: {
    PlayerAuth: async (root, args) => {
      console.log("here is auth", args.firebaseAuth)
      let player = await Player.findOne({ firebaseAuth: args.firebaseAuth })
      return player
    },
    FindPlayer: (args) => Player.findOne({ username: args.username }),
    GetAllPlayers: async () => {
      const players = await Player.find()
      return players
    },
    GetAllGames: async () => {
      let games = await Game.find({})
      return games
    },
    GetGameById: async (root, args) => {
      console.log(args)
      let game = await Game.findOne({ _id: args.gameId })
      return game
    },
  },
  Mutation: {
    CreatePlayer: async (root, args) => {
      console.log("creating user called", args.firebaseAuth)
      const player = await new Player({ firebaseAuth: args.firebaseAuth })
      try {
        player.save()
      } catch (error) {
        throw new GraphQLError("player not created, firebase missing", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        })
      }
      return { code: 200, message: "success", success: true, player: player }
    },
    UpdatePlayer: async (root, args, contextValue) => {
      console.log("updatePlayer")
      console.log(args)
      const player = await Player.findOneAndUpdate(
        { firebaseAuth: args.firebaseAuth },
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
      // setting New option to True will return the document after update was applied
      return {
        code: 200,
        message: "see what happens",
        success: true,
        player: player,
      }
    },
    CreateGame: async (root, args) => {
      console.log("creating game")
      const game = await new Game({
        playerCount: args.playerCount,
        homeTeam: args.homeTeam,
        awayTeam: args.awayTeam,
      })
      try {
        game.save()
        console.log("game saved")
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
  Subscription: {
    GameAdded: {
      subscribe: () => pubsub.asyncIterator("GAME_ADDED"),
    },
  },
}

module.exports = resolvers
