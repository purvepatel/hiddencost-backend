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

-- Complete schema with all tables

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    brand_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Cost Factors table
CREATE TABLE IF NOT EXISTS cost_factors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    cost_type VARCHAR(50) NOT NULL,
    cost_name VARCHAR(100) NOT NULL,
    cost_amount DECIMAL(10, 2) NOT NULL,
    frequency VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert sample brands
INSERT INTO brands (name, category, description) VALUES
('Apple', 'Electronics', 'Premium consumer electronics'),
('Samsung', 'Electronics', 'Global electronics manufacturer'),
('Sony', 'Electronics', 'Consumer electronics'),
('Microsoft', 'Technology', 'Software and hardware'),
('Dell', 'Computers', 'Computer hardware');