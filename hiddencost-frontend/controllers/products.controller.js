const db = require('../config/db');

exports.getAllProducts = (req, res) => {
  // only return products belonging to the logged-in user
  const userId = req.user && req.user.id;
  let sql = 'SELECT * FROM products';
  const params = [];
  if (userId) {
    sql += ' WHERE user_id = ?';
    params.push(userId);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createProduct = (req, res) => {
  const { brand_id, name, base_price, product_type } = req.body;
  const userId = req.user && req.user.id; // coming from protect middleware

  db.query(
    'INSERT INTO products (user_id, brand_id, name, base_price, product_type) VALUES (?, ?, ?, ?, ?)',
    [userId, brand_id, name, base_price, product_type],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId });
    }
  );
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, base_price, product_type } = req.body;
  const userId = req.user && req.user.id;

  db.query(
    'UPDATE products SET name = ?, base_price = ?, product_type = ? WHERE id = ? AND user_id = ?',
    [name, base_price, product_type, id, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found or not owned by user' });
      }
      res.json({ message: 'Product updated' });
    }
  );
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user.id;

  db.query('DELETE FROM products WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found or not owned by user' });
    }
    res.json({ message: 'Product deleted' });
  });
};
