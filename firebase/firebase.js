const { initializeApp, cert } = require("firebase-admin/app")
const { getAuth } = require("firebase-admin/auth")
const admin = require("firebase-admin")

const serviceAccountKey = require("../google-credentials.json")
console.log(serviceAccountKey)

const app = initializeApp({
  credential: cert(serviceAccountKey),
})
const auth = getAuth(app)
module.exports = auth
