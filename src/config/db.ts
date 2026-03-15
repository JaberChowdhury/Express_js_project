import { Pool } from "pg";
import config from "./index.ts";

if (!process.env.CONNECTION_STRING) {
  throw new Error("CONNECTION_STRING missing in .env");
}

const pool = new Pool({
  connectionString: config.connection_string,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description VARCHAR(400),
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("Tables created or already exist");
  } catch (err) {
    console.error("Error creating tables:", err);
    throw err;
  }
};

export { pool, initDB };
