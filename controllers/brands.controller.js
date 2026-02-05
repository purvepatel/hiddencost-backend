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
