const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

// Public routes
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductDetail);
router.get('/categories', productController.getCategories);

module.exports = router;
