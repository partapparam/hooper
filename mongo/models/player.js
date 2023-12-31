const mongoose = require("mongoose")
const { Schema, model } = mongoose

/**
 * toJSON Transform function will allow us to edit the JSON object that is sent back, removing fields and changing the _id to id
 */

const playersSchema = new Schema(
  {
    username: { type: String },
    name: {
      first: {
        type: String,
      },
      last: { type: String },
    },
    profilePhoto: String,
    location: {
      type: String,
    },
    phone: String,
    firebaseUID: String,
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
/**
 * Validates unique phone number
 */
playersSchema.path("phone").validate(async (phone) => {
  const phoneCount = await Player.countDocuments({
    phone: phone,
  })
  return !phoneCount
}, "Phone number already exists. Please log in. ")

/**Username already exists */
playersSchema.path("username").validate(async (username) => {
  const usernameCount = await Player.countDocuments({
    username: username,
  })
  return !usernameCount
}, "Username already exists")

playersSchema.statics.playerSearch = function (searchTerm) {
  const stringSearchFields = ["name.first", "name.last", "username"]
  // const numberSearchFields = ["phone"]
  const query = {
    $or: [
      /**
       * Search string contains
       */
      ...stringSearchFields.map((field) => ({
        [field]: new RegExp(`^${searchTerm}`, "i"),
      })),
      /**
       * Search substring of a string.
       */
      // ...stringSearchFields.map((field) => ({
      //   [field]: new RegExp(`^.*${searchTerm}.*`, "i"),
      // })),
      // ...numberSearchFields.map((field) => ({
      //   $where: `/^${searchTerm}.*/.test(this.${field})`,
      // })),
    ],
  }
  return this.find(query)
}

const Player = model("Player", playersSchema)

module.exports = Player
