import { Pool } from "pg";

// Connect to Render Postgres using the DATABASE_URL environment variable
const CLEANUPS_POOL = new Pool({
  connectionString: process.env.CLEANUPS_DB_URL,
  ssl: { rejectUnauthorized: false }
});

const USERS_POOL = new Pool({
  connectionString: process.env.USERS_DB_URL,
  ssl: { rejectUnauthorized: false }
});

const REPORTS_POOL = new Pool({
  connectionString: process.env.REPORTS_DB_URL,
  ssl: { rejectUnauthorized: false }
});

const SPOTS_POOL = new Pool({
  connectionString: process.env.SPOTS_DB_URL,
  ssl: { rejectUnauthorized: false }
});


