const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');  // ADD THIS
const brandsRoutes = require('./routes/brands.routes');
const productsRoutes = require('./routes/products.routes');
const costFactorsRoutes = require('./routes/costFactors.routes');

const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Auth routes (public)
app.use('/api/auth', authRoutes);  // ADD THIS

// Resource routes (should be protected)
app.use('/api/brands', brandsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cost-factors', costFactorsRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HiddenCost API with JWT Authentication',
    endpoints: {
      public: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      protected: {
        profile: 'GET /api/auth/me (requires token)',
        brands: '/api/brands/* (requires token)',
        products: '/api/products/* (requires token)',
        costFactors: '/api/cost-factors/* (requires token)'
      }
    },
    note: 'Include header: Authorization: Bearer YOUR_TOKEN'
  });
});

module.exports = app;
