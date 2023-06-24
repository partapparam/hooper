const mongoose = require("mongoose")

/**
 * toJSON Transform function will allow us to edit the JSON object that is sent back, removing fields and changing the _id to id
 */

const usersSchema = new mongoose.Schema(
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
    email: { type: String, required: true, message: "Email is required" },
    passwordHash: {
      type: String,
      required: true,
      message: "password is required",
    },
    profilePhoto: String,
    phone: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
      },
    },
  }
)
/**
 * Validates unique email
 */
usersSchema.path("email").validate(async (email) => {
  const emailCount = await User.countDocuments({
    email: email,
  })
  return !emailCount
}, "Email already exists")

/**Username already exists */
usersSchema.path("username").validate(async (username) => {
  const usernameCount = await User.countDocuments({
    username: username,
  })
  return !usernameCount
}, "Username already exists")

const User = mongoose.model("User", usersSchema)

module.exports = User
