import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../backend/config/database';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('Running database migration...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../migrations/create_diagrams_table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration(); 