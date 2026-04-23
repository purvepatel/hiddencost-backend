const db = require('../config/db');

exports.getAllProducts = (req, res) => {
  // only return products belonging to the logged-in user
  const userId = req.user && req.user.id;
  let sql = `SELECT p.*, b.name AS brand_name FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id`;
  const params = [];
  if (userId) {
    sql += ' WHERE p.user_id = ?';
    params.push(userId);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getProductById = (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user.id;

  db.query(
    `SELECT p.*, b.name AS brand_name FROM products p
     LEFT JOIN brands b ON p.brand_id = b.id
     WHERE p.id = ? AND p.user_id = ?`,
    [id, userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (!results || results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(results[0]);
    }
  );
};

exports.createProduct = (req, res) => {
  const { brand_id, name, base_price, product_type, description } = req.body;
  const userId = req.user && req.user.id; // coming from protect middleware

  if (!brand_id || !name || base_price === undefined || !product_type) {
    return res.status(400).json({ message: 'brand_id, name, base_price, and product_type are required' });
  }

  db.execute(
    'INSERT INTO products (user_id, brand_id, name, base_price, product_type, description) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, brand_id, name, base_price, product_type, description || null],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId });
    }
  );
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { brand_id, name, base_price, product_type, description } = req.body;
  const userId = req.user && req.user.id;

  db.execute(
    'UPDATE products SET brand_id = ?, name = ?, base_price = ?, product_type = ?, description = ? WHERE id = ? AND user_id = ?',
    [brand_id, name, base_price, product_type, description || null, id, userId],
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

  db.execute('DELETE FROM products WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found or not owned by user' });
    }
    res.json({ message: 'Product deleted' });
  });
};
