const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { protect } = require('../middleware/auth');  

// All routes require authentication
router.use(protect);  

router.get('/', productsController.getAllProducts);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;