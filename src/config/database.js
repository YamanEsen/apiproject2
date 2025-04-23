const { Client } = require('pg');
require('dotenv').config();

// Create a new PostgreSQL client using environment variables
const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'flight_management',
  password: process.env.DB_PASSWORD || 'rahatadam1',
  port: process.env.DB_PORT || 5432,
});

// Connect to the database
const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Connection error', err.stack);
    process.exit(1); // Exit with failure
  }
};

module.exports = { client, connectDB };
