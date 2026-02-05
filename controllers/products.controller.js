const db = require('../config/db');

exports.getAllProducts = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createProduct = (req, res) => {
  const { brand_id, name, base_price, product_type } = req.body;

  db.query(
    'INSERT INTO products (brand_id, name, base_price, product_type) VALUES (?, ?, ?, ?)',
    [brand_id, name, base_price, product_type],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId });
    }
  );
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, base_price, product_type } = req.body;

  db.query(
    'UPDATE products SET name = ?, base_price = ?, product_type = ? WHERE id = ?',
    [name, base_price, product_type, id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Product updated' });
    }
  );
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM products WHERE id = ?', [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Product deleted' });
  });
};
