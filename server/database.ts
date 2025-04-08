import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const { Pool } = pg;
import * as schema from '@shared/schema';

// Define a variable to track database connection status
export let dbConnectionSuccessful = false;

// Initialize with undefined, will be set during initialization
export let db: ReturnType<typeof drizzle>;

// Initialize the database
export async function initializeDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Create connection pool to local PostgreSQL
    const pool = new Pool({
      connectionString: "postgres://postgres:Musi%401909@localhost:5432/businessboost"
    });
    
    // Test connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0].now);
    client.release();
    
    // Create the Drizzle ORM instance
    db = drizzle(pool, { schema });
    
    // Set the success flag
    dbConnectionSuccessful = true;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    console.warn('Falling back to in-memory storage');
    dbConnectionSuccessful = false;
    return false;
  }
}
