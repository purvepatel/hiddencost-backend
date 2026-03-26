const db = require('../config/db');

exports.getAllBrands = (req, res) => {
  db.query('SELECT * FROM brands', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createBrand = (req, res) => {
  const { name, category, description } = req.body;

  db.query(
    'INSERT INTO brands (name, category, description) VALUES (?, ?, ?)',
    [name, category, description],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId });
    }
  );
};

exports.updateBrand = (req, res) => {
  const { id } = req.params;
  const { name, category, description } = req.body;

  db.query(
    'UPDATE brands SET name = ?, category = ?, description = ? WHERE id = ?',
    [name, category, description, id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Brand updated' });
    }
  );
};

exports.deleteBrand = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM brands WHERE id = ?', [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Brand deleted' });
  });
};
