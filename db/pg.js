const { Pool } = require("pg")
const connectionString = process.env.POSTGRES_DB

if (!connectionString) {
  console.log("There is not connection")
  process.exit(-1)
}

const pool = new Pool({
  connectionString,
})

pool.on("error", (err, client) => {
  console.error("Error on PG Pool")
  process.exit(-1)
})

module.exports = {
  query: (query = "", values = []) => {
    return pool.query(query, values)
  },
  client: () => {
    return pool.connect()
  },
}
