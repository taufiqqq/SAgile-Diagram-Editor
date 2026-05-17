import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

// Decode CA cert from Base64 env variable, if provided
let sslConfig: any = {};
if (process.env.REQUIRE_SSL === 'true') {
  if (process.env.DB_CA_CERT_BASE64) {
    sslConfig = {
      ssl: {
        ca: Buffer.from(process.env.DB_CA_CERT_BASE64, 'base64'),
        rejectUnauthorized: true, // keeps SSL verification secure
      },
    };
  } else {
    // Fallback: connect with SSL but skip verification (less secure)
    sslConfig = {
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 25060,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...sslConfig,
});

export default pool;
