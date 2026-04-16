const mysql = require('mysql2');

// Try to connect to remote MySQL
let db = null;
const remoteConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
};

// Create pool
try {
  db = mysql.createPool(remoteConfig);
  
  // Test connection
  db.query('SELECT 1', (err) => {
    if (err) {
      console.error('[DB Connection Failed]', err.message);
      console.error('[WARNING] Could not connect to remote database. Ensure the host is reachable.');
    } else {
      console.log('[DB Connected Successfully to Remote MySQL]');
    }
  });
} catch (error) {
  console.error('[DB Pool Creation Error]', error.message);
}

// Add connection error handling
if (db) {
  db.on('error', (err) => {
    console.error('[Database Error]', err);
  });
}

module.exports = db;
