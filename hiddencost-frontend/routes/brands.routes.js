const express = require('express');
const router = express.Router();
const controller = require('../controllers/brands.controller');
const { protect } = require('../middleware/auth');  

// All routes require authentication
router.use(protect); 

router.get('/', controller.getAllBrands);
router.post('/', controller.createBrand);
router.put('/:id', controller.updateBrand);
router.delete('/:id', controller.deleteBrand);

module.exports = router;
