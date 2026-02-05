const express = require('express');
const cors = require('cors');

const brandsRoutes = require('./routes/brands.routes');
const productsRoutes = require('./routes/products.routes');
const costFactorsRoutes = require('./routes/costFactors.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/brands', brandsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cost-factors', costFactorsRoutes);

app.get('/', (req, res) => {
  res.send('HiddenCost API is running');
});

module.exports = app;
