import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const pool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  max: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '10'), // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if unable to connect
});

// Optional: Log when a client is acquired or released
pool.on('connect', () => {
  console.log('PostgreSQL client connected');
});

pool.on('remove', () => {
  console.log('PostgreSQL client removed from pool');
});

export default pool;