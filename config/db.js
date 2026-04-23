const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function ensureColumn(connection, tableName, columnName, definition) {
  const [rows] = await connection.promise().query(`SHOW COLUMNS FROM ${tableName} LIKE ?`, [columnName]);
  if (rows.length === 0) {
    await connection.promise().query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function ensureForeignKey(connection, tableName, constraintName, definition) {
  const [rows] = await connection.promise().query(
    `SELECT CONSTRAINT_NAME
     FROM information_schema.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND CONSTRAINT_NAME = ?`,
    [tableName, constraintName]
  );

  if (rows.length === 0) {
    await connection.promise().query(`ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} ${definition}`);
  }
}

async function seedDemoUsers(connection) {
  const demoUsers = [
    {
      username: 'demo_user',
      email: 'user@hiddencost.local',
      password: 'User12345!',
      first_name: 'Demo',
      last_name: 'User',
      role: 'user',
    },
    {
      username: 'demo_admin',
      email: 'admin@hiddencost.local',
      password: 'Admin12345!',
      first_name: 'Demo',
      last_name: 'Admin',
      role: 'admin',
    },
  ];

  for (const user of demoUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await connection.promise().execute(
      `INSERT INTO users (username, email, password, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         password = VALUES(password),
         first_name = VALUES(first_name),
         last_name = VALUES(last_name),
         role = VALUES(role)`,
      [user.username, user.email, hashedPassword, user.first_name, user.last_name, user.role]
    );
  }
}

async function seedBrands(connection) {
  const brands = [
    ['Apple', 'Electronics', 'Premium consumer electronics'],
    ['Samsung', 'Electronics', 'Global electronics manufacturer'],
    ['Sony', 'Electronics', 'Consumer electronics'],
    ['Microsoft', 'Technology', 'Software and hardware'],
    ['Dell', 'Computers', 'Computer hardware'],
    ['Toyota', 'Automotive', 'Vehicle manufacturer'],
  ];

  for (const [name, category, description] of brands) {
    await connection.promise().execute(
      `INSERT INTO brands (name, category, description)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         category = VALUES(category),
         description = VALUES(description)`,
      [name, category, description]
    );
  }
}

async function initDatabase() {
  const connection = await pool.promise().getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        role ENUM('user', 'admin') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(50),
        description TEXT,
        website VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        brand_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        base_price DECIMAL(10, 2) NOT NULL,
        product_type VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await ensureColumn(connection, 'products', 'user_id', 'INT NOT NULL DEFAULT 1 AFTER id');
    await ensureColumn(connection, 'products', 'brand_id', 'INT NOT NULL DEFAULT 1 AFTER user_id');
    await ensureColumn(connection, 'products', 'name', 'VARCHAR(150) NOT NULL AFTER brand_id');
    await ensureColumn(connection, 'products', 'base_price', 'DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER name');
    await ensureColumn(connection, 'products', 'product_type', 'VARCHAR(50) NOT NULL DEFAULT \'Other\' AFTER base_price');
    await ensureColumn(connection, 'products', 'description', 'TEXT NULL AFTER product_type');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cost_factors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        cost_type VARCHAR(50) NOT NULL,
        cost_name VARCHAR(100) NOT NULL,
        cost_amount DECIMAL(10, 2) NOT NULL,
        frequency VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await ensureColumn(connection, 'cost_factors', 'product_id', 'INT NOT NULL AFTER id');
    await ensureColumn(connection, 'cost_factors', 'user_id', 'INT NOT NULL DEFAULT 1 AFTER product_id');
    await ensureColumn(connection, 'cost_factors', 'cost_type', 'VARCHAR(50) NOT NULL DEFAULT \'Other\' AFTER user_id');
    await ensureColumn(connection, 'cost_factors', 'cost_name', 'VARCHAR(100) NOT NULL DEFAULT \'Additional Cost\' AFTER cost_type');
    await ensureColumn(connection, 'cost_factors', 'cost_amount', 'DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER cost_name');
    await ensureColumn(connection, 'cost_factors', 'frequency', 'VARCHAR(50) NULL AFTER cost_amount');

    await ensureForeignKey(
      connection,
      'products',
      'fk_products_user',
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
    );
    await ensureForeignKey(
      connection,
      'products',
      'fk_products_brand',
      'FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE'
    );
    await ensureForeignKey(
      connection,
      'cost_factors',
      'fk_cost_factors_product',
      'FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE'
    );
    await ensureForeignKey(
      connection,
      'cost_factors',
      'fk_cost_factors_user',
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
    );

    await seedDemoUsers(connection);
    await seedBrands(connection);

    console.log('[MySQL Connected Successfully]');
    console.log('[Database Initialized]');
  } finally {
    connection.release();
  }
}

const dbWrapper = {
  query(sql, params, callback) {
    const values = typeof params === 'function' ? [] : params;
    const done = typeof params === 'function' ? params : callback;

    pool.query(sql, values, (err, results) => {
      if (err) {
        console.error('MySQL Query Error:', err.message);
        return done(err);
      }
      return done(null, results);
    });
  },

  execute(sql, params, callback) {
    const values = typeof params === 'function' ? [] : params;
    const done = typeof params === 'function' ? params : callback;

    pool.execute(sql, values, (err, results) => {
      if (err) {
        console.error('MySQL Execute Error:', err.message);
        return done(err);
      }
      return done(null, results);
    });
  },

  initDatabase,
  pool,
};

module.exports = dbWrapper;
