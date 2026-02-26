-- Add Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password',
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Update products table to link to users
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id INT;
ALTER TABLE products ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update cost_factors table to link to users
ALTER TABLE cost_factors ADD COLUMN IF NOT EXISTS user_id INT;
ALTER TABLE cost_factors ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;