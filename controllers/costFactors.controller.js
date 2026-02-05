const db = require('../config/db');

exports.getCostFactorsByProduct = (req, res) => {
  const { productId } = req.params;

  db.query(
    'SELECT * FROM cost_factors WHERE product_id = ?',
    [productId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

exports.createCostFactor = (req, res) => {
  const { product_id, cost_type, cost_amount, frequency } = req.body;

  db.query(
    'INSERT INTO cost_factors (product_id, cost_type, cost_amount, frequency) VALUES (?, ?, ?, ?)',
    [product_id, cost_type, cost_amount, frequency],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId });
    }
  );
};

exports.deleteCostFactor = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM cost_factors WHERE id = ?', [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Cost factor deleted' });
  });
};
