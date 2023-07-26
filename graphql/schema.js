const typeDefs = `#graphql
# A Schema is not responsible for defining where the data comes from or hows it stored. It defines a collection of types and the relationships between those types



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
        homeTeam: [Player!]! # this list can't be null and the list items can't be null
        awayTeam: [Player!] #the list items can't be null
    }

    type Query {
        PlayerAuth(firebaseAuth: String): Player
        FindPlayer(name: String): Player
        GetAllPlayers: [Player]
        GetGameById(gameId: String): Game
        GetAllGames: [Game]
        GetAllGamesByPlayer(playerId: String): [Game]
        GetHomeTeamPlayer(playerId: String): Player
    }

    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
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

    type UpdatePlayerPhotoResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        player: Player!
    }

    type CreateGameResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        game: Game!
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
        ): UpdatePlayerPhotoResponse

        CreateGame(
            playerCount: Int!
            homeTeam: [String]!
            awayTeam: [String]!
            createdByFirebaseAuth: String!
        ): CreateGameResponse

        
    }
`

module.exports = typeDefs
