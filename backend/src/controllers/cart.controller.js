const CartService = require('../services/cart.service');
const { validationResult } = require('express-validator');

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  // GET /api/cart - Lấy giỏ hàng
  async getCart(req, res) {
    try {
      const userId = req.user.id;
      const cart = await this.cartService.getCartForDisplay(userId);

      res.json({
        success: true,
        data: cart,
      });
    } catch (error) {
      console.error('getCart backend error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/cart - Thêm sản phẩm vào giỏ
  async addToCart(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const { productId, quantity } = req.body;

      const cart = await this.cartService.addToCart(userId, productId, quantity);

      res.json({
        success: true,
        message: 'Thêm sản phẩm vào giỏ thành công',
        data: cart,
      });
    } catch (error) {
      console.error('addToCart backend error:', error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PUT /api/cart/:itemId - Cập nhật số lượng
  async updateCartItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const { itemId } = req.params;
      const { quantity } = req.body;

      const cart = await this.cartService.updateCartItem(userId, itemId, quantity);

      res.json({
        success: true,
        message: 'Cập nhật số lượng thành công',
        data: cart,
      });
    } catch (error) {
      console.error('updateCartItem backend error:', error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /api/cart/:itemId - Xóa sản phẩm khỏi giỏ
  async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;

      const cart = await this.cartService.removeFromCart(userId, itemId);

      res.json({
        success: true,
        message: 'Xóa sản phẩm khỏi giỏ thành công',
        data: cart,
      });
    } catch (error) {
      console.error('removeFromCart backend error:', error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /api/cart - Xóa toàn bộ giỏ hàng
  async clearCart(req, res) {
    try {
      const userId = req.user.id;

      const cart = await this.cartService.clearCart(userId);

      res.json({
        success: true,
        message: 'Xóa toàn bộ giỏ hàng thành công',
        data: cart,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = CartController;
