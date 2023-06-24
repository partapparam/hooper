const mongoose = require("mongoose")

// Game Schema
const gameSchema = new mongoose.Schema({
  //   game_id: { type: Number, required: true },
  //   game_date: { type: Date, required: true },
  player_count: { type: Number, required: true, enum: [2, 4, 6, 8, 10] },
  winning_team: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  losing_team: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
})

const Game = mongoose.model("Game", gameSchema)
module.exports = Game
