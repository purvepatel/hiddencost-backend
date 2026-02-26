const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;

        // Validate
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, email, and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        User.findByEmail(email, async (err, users) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            
            if (users.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            // Create user
            await User.create({ username, email, password, first_name, last_name }, (err, result) => {
                if (err) return res.status(500).json({ success: false, error: err.message });

                const token = generateToken(result.insertId);

                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    token,
                    user: { id: result.insertId, username, email, first_name, last_name }
                });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.login = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        User.findByEmail(email, async (err, users) => {
            if (err) return res.status(500).json({ success: false, error: err.message });

            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const user = users[0];

            // Check password
            const isPasswordValid = await User.comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const token = generateToken(user.id);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getMe = (req, res) => {
    User.findById(req.user.id, (err, users) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: users[0] });
    });
};  