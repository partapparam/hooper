const typeDefs = `#graphql

# Define the queryable fields
    type Name {
        firstName: String!
        lastName: String!
    }

    type Score {
        home: Int!
        away: Int!
    }

    type Player {
        name: Name!
        phone: String!
        location: String!
        photoURL: String!
        username: String!
        firebaseAuth: String!
    }

    type Game {
        playerCount: Int!
        winningTeam: Int
        score: Score!
        homeTeam: [Player!]
        awayTeam: [Player!]
    }

    # defines the all of the available queries that clients can execute, along with the return types for each
    type Query {
        playerAuth(firebaseAuth: String): Player
        findPlayer(name: String): Player
    }

    type Mutation {
        updatePlayer(
            username: String!
            firstName: String!
            lastName: String!
            location: String!
            firebaseAuth: String!
        ): Player

        createPlayer(
            firebaseAuth: String!
        ): Player

        updatePlayerPhoto(
            photoURL: String!
        ): Player

        
    }
`

module.exports = typeDefs
