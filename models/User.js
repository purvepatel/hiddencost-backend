const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static findByEmail(email, callback) {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    }

    static findByUsername(username, callback) {
        db.query('SELECT * FROM users WHERE username = ?', [username], callback);
    }

    static findById(id, callback) {
        db.query(
            'SELECT id, username, email, first_name, last_name, role, is_active, created_at FROM users WHERE id = ?',
            [id],
            callback
        );
    }

    static async create(userData, callback) {
        const { username, email, password, first_name, last_name } = userData;
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.query(
            'INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, first_name, last_name],
            callback
        );
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;