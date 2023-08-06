const { GraphQLError } = require("graphql")
const Player = require("../mongo/models/player")
const Game = require("../mongo/models/games")
// Publish Subscribe for subsciptions
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

// Check to see if player already exists. Return player instead of creating a new one
const validate = async (firebaseUID) => {
  return await Player.findOne({ firebaseUID })
}

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
      return parent.awayTeam.map((id) => {
        return Player.findOne({ _id: id })
      })
    },
  },
  Query: {
    GetPlayerProfileByAuth: async (root, args) => {
      console.log("here is player by auth", args.firebaseUID)
      let player = await Player.findOne({ firebaseUID: args.firebaseUID })
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
      console.log("creating user called")
      try {
        // Check to see if a user already exists with this ID. Return that user instead of creating a new one.
        const existingUser = await validate(args.firebaseUID)
        if (existingUser) {
          return {
            code: 200,
            message: "Player already exists, welcome back",
            success: true,
            player: existingUser,
          }
        }
        const player = await new Player({
          firebaseUID: args.firebaseUID,
          phone: args.phone,
        }).save()
        return {
          code: 200,
          message: "Your account has been created. Welcome to Hooper",
          success: true,
          player: player,
        }
      } catch (error) {
        throw new GraphQLError(
          "Player not created, an account already exists at with this phone number. Please try again",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.firebaseUID,
            },
          }
        )
      }
    },
    UpdatePlayer: async (root, args, contextValue) => {
      console.log("updatePlayer")
      console.log(contextValue.currentUser)
      const player = await Player.findOneAndUpdate(
        { firebaseUID: args.firebaseUID },
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
    CreateGame: async (root, args, context) => {
      console.log("creating game", args)

      const game = await new Game({
        playerCount: args.playerCount,
        homeTeam: [args.homeTeam],
        awayTeam: [args.awayTeam],
        createdByPlayerId: args.createdByPlayerId,
        score: {
          away: args.away,
          home: args.home,
        },
        winningTeam: args.winningTeam,
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
