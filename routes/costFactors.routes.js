const express = require('express');
const router = express.Router();
const controller = require('../controllers/costFactors.controller');
const { protect } = require('../middleware/auth');  

// All routes require authentication
router.use(protect); 

router.get('/', controller.getAllCostFactors);
// optional helper to list factors for a specific product
router.get('/product/:productId', controller.getCostFactorsByProduct);
router.post('/', controller.createCostFactor);
router.put('/:id', controller.updateCostFactor);
router.delete('/:id', controller.deleteCostFactor);

module.exports = router;
