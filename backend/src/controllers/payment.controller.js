const PaymentService = require('../services/payment.service');
const { validationResult } = require('express-validator');

class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
  }

  // GET /api/payments/:paymentId - Lấy thông tin thanh toán
  async getPayment(req, res) {
    try {
      const { paymentId } = req.params;

      const payment = await this.paymentService.getPaymentInfo(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Thanh toán không tồn tại',
        });
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders/:orderId/payment - Lấy thông tin thanh toán của đơn hàng
  async getOrderPayment(req, res) {
    try {
      const { orderId } = req.params;

      const payment = await this.paymentService.getPaymentByOrderId(orderId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Thanh toán không tồn tại',
        });
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/payments/:paymentId/confirm - Xác nhận thanh toán
  async confirmPayment(req, res) {
    try {
      const { paymentId } = req.params;

      const result = await this.paymentService.confirmPayment(paymentId);

      res.json({
        success: true,
        message: result.message,
        data: result.payment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders/:orderId/payment-summary - Lấy tóm tắt thanh toán
  async getPaymentSummary(req, res) {
    try {
      const { orderId } = req.params;

      const summary = await this.paymentService.getPaymentSummary(orderId);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/payments/:paymentId/refund - Hoàn tiền
  async refundPayment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array(),
        });
      }

      const { paymentId } = req.params;
      const { reason } = req.body;

      const result = await this.paymentService.refundPayment(paymentId, reason);

      res.json({
        success: true,
        message: result.message,
        data: result.refund,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = PaymentController;
