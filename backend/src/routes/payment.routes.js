const express = require('express');
const PaymentController = require('../controllers/payment.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');
const validations = require('../middlewares/shopping.validation');

const router = express.Router();
const paymentController = new PaymentController();

// Apply authentication middleware to all routes
router.use(verifyAuth);

// GET /api/payments/:paymentId - Lấy thông tin thanh toán
router.get('/:paymentId', (req, res) => paymentController.getPayment(req, res));

// POST /api/payments/:paymentId/confirm - Xác nhận thanh toán
router.post('/:paymentId/confirm', (req, res) => paymentController.confirmPayment(req, res));

// GET /api/orders/:orderId/payment - Lấy thông tin thanh toán của đơn hàng
router.get('/order/:orderId', (req, res) => paymentController.getOrderPayment(req, res));

// GET /api/orders/:orderId/payment-summary - Lấy tóm tắt thanh toán
router.get(
  '/order/:orderId/summary',
  (req, res) => paymentController.getPaymentSummary(req, res)
);

// POST /api/payments/:paymentId/refund - Hoàn tiền
router.post(
  '/:paymentId/refund',
  validations.validateRefundPayment,
  (req, res) => paymentController.refundPayment(req, res)
);

module.exports = router;
