const express = require('express');
const router = express.Router();
const controller = require('../controllers/brands.controller');

router.get('/', controller.getAllBrands);
router.post('/', controller.createBrand);

module.exports = router;
