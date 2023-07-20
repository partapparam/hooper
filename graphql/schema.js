const typeDefs = `#graphql
# A Schema is not responsible for defining where the data comes from or hows it stored. It defines a collection of types and the relationships between those types

# Define the queryable fields
"Descriptions for the type"
"""
multiline Descriptions
"""
    type Name {
        #Cant return null if "!"
        firstName: String!
        lastName: String!
    }

    type Score {
        home: Int
        away: Int
    }

    type Player {
        name: Name
        phone: String
        location: String
        photoURL: String
        username: String
        firebaseAuth: String!
    }

    type Game {
        playerCount: Int!
        winningTeam: Int
        score: Score!
        homeTeam: [Player!]! # this list can't be null and the list items can't be null
        awayTeam: [Player!] #the list items can't be null
    }

    # defines all of the available queries that clients can execute, along with the return types for each
    type Query {
        PlayerAuth(firebaseAuth: String): Player
        FindPlayer(name: String): Player
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

    type Mutation {
        UpdatePlayer(
            username: String!
            firstName: String!
            lastName: String!
            location: String!
            firebaseAuth: String!
        ): Player

        CreatePlayer(
            firebaseAuth: String!
        ): CreatePlayerMutationResponse

        UpdatePlayerPhoto(
            photoURL: String!
        ): Player

        
    }
`

module.exports = typeDefs
