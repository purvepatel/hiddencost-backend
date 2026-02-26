const db = require('../config/db');

// return all cost factors belonging to logged-in user
exports.getAllCostFactors = (req, res) => {
  const userId = req.user && req.user.id;
  db.query('SELECT * FROM cost_factors WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// update existing cost factor owned by user
exports.updateCostFactor = (req, res) => {
  const { id } = req.params;
  const { cost_type, cost_amount, frequency } = req.body;
  const userId = req.user && req.user.id;

  db.query(
    'UPDATE cost_factors SET cost_type = ?, cost_amount = ?, frequency = ? WHERE id = ? AND user_id = ?',
    [cost_type, cost_amount, frequency, id, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cost factor not found or not owned by user' });
      }
      res.json({ message: 'Cost factor updated' });
    }
  );
};

exports.getCostFactorsByProduct = (req, res) => {
  const { productId } = req.params;
  const userId = req.user && req.user.id;

  db.query(
    'SELECT * FROM cost_factors WHERE product_id = ? AND user_id = ?',
    [productId, userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

exports.createCostFactor = (req, res) => {
  const { product_id, cost_type, cost_amount, frequency } = req.body;
  const userId = req.user && req.user.id;

  db.query(
    'INSERT INTO cost_factors (user_id, product_id, cost_type, cost_amount, frequency) VALUES (?, ?, ?, ?, ?)',
    [userId, product_id, cost_type, cost_amount, frequency],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId });
    }
  );
};

exports.deleteCostFactor = (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user.id;

  db.query('DELETE FROM cost_factors WHERE id = ? AND user_id = ?', [id, userId], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Cost factor deleted' });
  });
};
