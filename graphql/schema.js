const typeDefs = `#graphql
# A Schema is not responsible for defining where the data comes from or hows it stored. It defines a collection of types and the relationships between those types

# Define the queryable fields
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
