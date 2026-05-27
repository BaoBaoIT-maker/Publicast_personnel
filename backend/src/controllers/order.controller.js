const OrderService = require('../services/order.service');
const PaymentService = require('../services/payment.service');
const { validationResult } = require('express-validator');

class OrderController {
  constructor() {
    this.orderService = new OrderService();
    this.paymentService = new PaymentService();
  }

  // POST /api/orders - Tạo đơn hàng
  async createOrder(req, res) {
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
      const { paymentMethod, shippingAddress, phoneNumber, notes } = req.body;

      // Validate payment method
      await this.paymentService.validatePaymentMethod(paymentMethod);

      const shippingData = {
        address: shippingAddress,
        phoneNumber,
        notes,
      };

      const order = await this.orderService.createOrder(userId, paymentMethod, shippingData);

      // Tạo bản ghi thanh toán
      const payment = await this.paymentService.processCODPayment(order.id);

      res.status(201).json({
        success: true,
        message: 'Đơn hàng được tạo thành công',
        data: {
          order,
          payment: payment.payment,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders - Lấy danh sách đơn hàng của user
  async getMyOrders(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const orders = await this.orderService.getMyOrders(userId, status);

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders/:orderId - Lấy chi tiết đơn hàng
  async getOrder(req, res) {
    try {
      const userId = req.user.id;
      const { orderId } = req.params;

      const order = await this.orderService.getOrderDetails(orderId, userId);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PUT /api/orders/:orderId/status - Cập nhật trạng thái (ADMIN ONLY)
  async updateOrderStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array(),
        });
      }

      const { orderId } = req.params;
      const { status } = req.body;

      const order = await this.orderService.updateOrderStatus(orderId, status);

      res.json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /api/orders/:orderId/cancel - Hủy đơn hàng
  async cancelOrder(req, res) {
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
      const { orderId } = req.params;
      const { reason } = req.body;

      const order = await this.orderService.cancelOrder(orderId, userId, reason);

      res.json({
        success: true,
        message: 'Hủy đơn hàng thành công',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/orders/:orderId/cancellation-request - Gửi yêu cầu hủy
  async requestCancellation(req, res) {
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
      const { orderId } = req.params;
      const { reason } = req.body;

      const order = await this.orderService.requestCancellation(orderId, userId, reason);

      res.json({
        success: true,
        message: 'Yêu cầu hủy đơn hàng đã được gửi',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders/:orderId/can-cancel - Kiểm tra có thể hủy không
  async canCancelOrder(req, res) {
    try {
      const userId = req.user.id;
      const { orderId } = req.params;

      const result = await this.orderService.canCancelOrder(orderId, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders/history - Lấy lịch sử mua hàng
  async getOrderHistory(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const history = await this.orderService.getOrderHistory(userId, page, limit);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders/stats - Lấy thống kê chi tiêu
  async getSpendingStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await this.orderService.getSpendingStats(userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = OrderController;
