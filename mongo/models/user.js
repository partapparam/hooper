const mongoose = require("mongoose")
const { Schema, model } = mongoose

/**
 * toJSON Transform function will allow us to edit the JSON object that is sent back, removing fields and changing the _id to id
 */

const usersSchema = new Schema(
  {
    username: { type: String, required: true, message: "Username is required" },
    name: {
      first: {
        type: String,
        required: true,
        message: "first name is required",
      },
      last: { type: String, required: true, message: "last name is required" },
    },
    // passwordHash: {
    //   type: String,
    //   required: true,
    //   message: "password is required",
    // },
    profilePhoto: String,
    phone: {
      type: String,
      required: true,
      message: "Phone number is required",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // delete returnedObject.passwordHash
      },
    },
  }
)
/**
 * Validates unique phone number
 */
usersSchema.path("phone").validate(async (phone) => {
  const phoneCount = await User.countDocuments({
    phone: phone,
  })
  return !phoneCount
}, "Phone number already exists. Please log in. ")

/**Username already exists */
usersSchema.path("username").validate(async (username) => {
  const usernameCount = await User.countDocuments({
    username: username,
  })
  return !usernameCount
}, "Username already exists")

const User = model("User", usersSchema)

module.exports = User
