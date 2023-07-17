const typeDefs = `
    type Name {
        firstName: String!
        lastName: String!
    }

    type Score {
        home: Number!
        away: Number!
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
        playerCount: Number!
        winningTeam: Number
        score: Score!
        homeTeam: [Player!]
        awayTeam: [Player!]
    }

    type Query {
        playerAuth(firebaseAuth: String): Player
        findPlayer(name: Name!): Player
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
