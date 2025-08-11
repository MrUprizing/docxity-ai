import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";

// Create a new Pool instance using the DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env variable is not set!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
