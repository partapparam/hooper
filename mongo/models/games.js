const mongoose = require("mongoose")
const { Schema, model } = mongoose

// Game Schema
const gamesSchema = new Schema(
  {
    player_count: { type: Number, required: true, enum: [2, 4, 6, 8, 10] },
    winning_team: { type: String },
    score: {
      home: { type: Number },
      away: { type: Number },
    },
    home_team: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    away_team: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
