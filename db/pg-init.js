const { Client } = require("pg")
const client = new Client(process.env.POSTGRES_DB)

const createScript = `
    CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    profile_photo VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE games (
  game_id SERIAL PRIMARY KEY,
  home_team INT[],
  away_team INT[],
  winning_team VARCHAR(10)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`

client.connect(async (err) => {
  if (err) {
    return console.error("Could not connect to postgres", err)
  }
  try {
    console.log("creating scripts")
    await Promise.all([
      client.query("DROP TABLE IF EXISTS users"),
      client.query("DROP RABLE IF EXISTS games"),
    ])
    console.log("drop table done")
    await client.query(createScript)
  } catch (err) {
    console.log("Failed to create tables")
    process.exit(-1)
  } finally {
    // Lets release the client
    client.end()
  }
})

/**
 * Helpful Link
 * https://www.guru99.com/postgresql-array-functions.html
 */

// Inserting into an Array value
// INSERT INTO games VALUES (1, ARRAY[Player_id], ARRAY[Player_id]);

// We can also use Curly braces
// INSERT INTO games VALUES (1, '{"player_id", "player_id"}', '{"player_id", "player_id"}' );

// Tracking the game players in normalized style
// CREATE TABLE game_players (
//   game_id INTEGER REFERENCES games(game_id),
//   player_id INTEGER REFERENCES players(player_id),
//   PRIMARY KEY (game_id, player_id)
// );
