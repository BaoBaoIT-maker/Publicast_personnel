const express = require('express');
const CartController = require('../controllers/cart.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');
const validations = require('../middlewares/shopping.validation');

const router = express.Router();
const cartController = new CartController();

// Apply authentication middleware to all routes
router.use(verifyAuth);

// GET /api/cart - Lấy giỏ hàng
router.get('/', (req, res) => cartController.getCart(req, res));

// POST /api/cart - Thêm sản phẩm vào giỏ
router.post(
  '/',
  validations.validateAddToCart,
  (req, res) => cartController.addToCart(req, res)
);

// PUT /api/cart/:itemId - Cập nhật số lượng
router.put(
  '/:itemId',
  validations.validateUpdateCartItem,
  (req, res) => cartController.updateCartItem(req, res)
);

// DELETE /api/cart/:itemId - Xóa sản phẩm khỏi giỏ
router.delete(
  '/:itemId',
  validations.validateRemoveFromCart,
  (req, res) => cartController.removeFromCart(req, res)
);

// DELETE /api/cart - Xóa toàn bộ giỏ hàng
router.delete('/', (req, res) => cartController.clearCart(req, res));

module.exports = router;
