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
    GetPlayerProfileByAuth: async (root, args) => {
      console.log("here is player by auth", args.firebaseAuth)
      let player = await Player.findOne({ firebaseAuth: args.firebaseAuth })
      return player
    },
    GetPlayerProfileByName: (args) =>
      Player.findOne({ username: args.username }),
    SearchPlayers: async (root, args) => {
      console.log("search", args)
      const players = await Player.playerSearch(args.searchTerm)
      console.log(players)
      return players
    },
    GetAllPlayers: async () => {
      console.log("get all players")
      const players = await Player.find()
      return players
    },
    GetAllGames: async () => {
      console.log("get all games")
      let games = await Game.find({})
      return games
    },
    GetGameById: async (root, args) => {
      console.log("get game by id")
      let game = await Game.findOne({ _id: args.gameId })
      return game
    },
    GetAllGamesByPlayer: async (root, args) => {
      console.log("get games by player")
      let games = await Game.find({ createdByPlayerId: args.createdByPlayerId })
      return games
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
    UpdatePlayerPhoto: async (root, args) => {
      console.log("update Player photo")
      const player = await Player.findOneAndUpdate(
        { _id: args.playerId },
        {
          profilePhoto: args.profilePhoto,
        },
        { new: true }
      )
      return {
        code: 200,
        message: "Profile Photo has been updated",
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
    UpdateGame: async (args) => {
      console.log("update game")
      try {
        const game = await Game.findOneAndUpdate(
          { _id: args.gameId },
          {
            score: {
              home: args.home,
              away: args.away,
            },
            winningTeam: args.winningTeam,
          }
        )

        return {
          code: 200,
          message: "The game has been updated",
          success: true,
          player: game,
        }
      } catch (err) {
        console.log("error updating game")
        return {
          code: 400,
          message: "Game cannot be updated, try again.",
          success: false,
        }
      }
    },
    DeleteGame: async (args) => {
      // Only the creator of the game should be able to delete.
      console.log("delete game")
      try {
        let deletedGame = await Game.deleteOne({ _id: args.gameId })
        return deletedGame
      } catch (err) {
        console.log("error deleting game")
        return {
          code: 400,
          message: "Game cannot be deleted.",
          success: false,
        }
      }
    },
  },
  Subscription: {
    GameAdded: {
      subscribe: () => pubsub.asyncIterator("GAME_ADDED"),
    },
  },
}

module.exports = resolvers
