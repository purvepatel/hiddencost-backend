const express = require('express');
const router = express.Router();
const controller = require('../controllers/costFactors.controller');

router.get('/:productId', controller.getCostFactorsByProduct);
router.post('/', controller.createCostFactor);
router.delete('/:id', controller.deleteCostFactor);

module.exports = router;
