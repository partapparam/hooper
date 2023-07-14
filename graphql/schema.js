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
    }

    type Game {
        playerCount: Number!
        winningTeam: Number
        score: Score!
        homeTeam: [Player!]
        awayTeam: [Player!]
    }
`
