const mongoose = require("mongoose")
const { Schema, model } = mongoose

// Game Schema
const gamesSchema = new Schema(
  {
    playerCount: { type: Number, required: true, enum: [2, 4, 6, 8, 10] },
    winningTeam: { type: String },
    score: {
      home: { type: Number },
      away: { type: Number },
    },
    homeTeam: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    awayTeam: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    createdByPlayerId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      },
    },
  }
)

const Game = model("Game", gamesSchema)
module.exports = Game
