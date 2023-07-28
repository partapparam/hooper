const typeDefs = `#graphql

    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }

    type Name {
        first: String
        last: String
    }

    type Score {
        home: Int
        away: Int
    }

    type Player {
        id: ID
        name: Name
        phone: String
        location: String
        photoURL: String
        username: String
        firebaseAuth: String!
    }

    type Game {
        id: ID
        playerCount: Int!
        winningTeam: Int
        score: Score!
        homeTeam: [Player!]! 
        awayTeam: [Player!]!
        createdByPlayerId: String 
    }

    type Query {
        GetPlayerProfileByAuth(firebaseAuth: String): Player
        GetPlayerProfileByName(name: String): Player
        GetAllPlayers: [Player]
        GetGameById(gameId: String): Game
        GetAllGames: [Game]
        GetAllGamesByPlayer(playerId: String): [Game]
    }

    type CreatePlayerMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        player: Player!
    }

    type UpdatePlayerMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        player: Player!
    }

    type UpdatePlayerPhotoMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        player: Player!
    }

    type CreateGameMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        game: Game!
    }

    type UpdateGameMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        game: Game!
    }

    type DeleteGameMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }

    type Mutation {
        UpdatePlayer(
            username: String!
            first: String!
            last: String!
            location: String!
            firebaseAuth: String!
        ): UpdatePlayerMutationResponse

        CreatePlayer(
            firebaseAuth: String!
        ): CreatePlayerMutationResponse

        UpdatePlayerPhoto(
            photoURL: String!
            playerId: String!
        ): UpdatePlayerPhotoMutationResponse

        CreateGame(
            playerCount: Int!
            homeTeam: [String]!
            awayTeam: [String]!
            createdByPlayerId: String!
        ): CreateGameMutationResponse

        UpdateGame(
            home: Int
            away: Int
            winningTeam: String
        ): UpdateGameMutationResponse

        DeleteGame(
            gameId: String!
            playerId: String!
        ): DeleteGameMutationResponse

    }


    type Subscription {
        GameAdded: Game!
    }
`

module.exports = typeDefs
