const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

// Public routes
router.get('/products', productController.getProducts);
router.get('/products/bestsellers', productController.getBestsellers);
router.get('/products/most-viewed', productController.getMostViewed);
router.get('/products/:id', productController.getProductDetail);
router.get('/categories/:categoryId/products', productController.getProductsByCategory);
router.get('/categories', productController.getCategories);

module.exports = router;
