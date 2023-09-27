const { initializeApp, cert } = require("firebase-admin/app")
const { getAuth } = require("firebase-admin/auth")
let serviceAccountKey
/**
 * Use in Dev mode
 */
if (process.env.NODE_ENV === "development") {
  serviceAccountKey = require("./serviceAccountKey.json")
}

/**
 * Use in Production mode
 */
if (process.env.NODE_ENV === "production") {
  serviceAccountKey = require("../google-credentials.json")
}

const app = initializeApp({
  credential: cert(serviceAccountKey),
})
const auth = getAuth(app)
module.exports = auth
