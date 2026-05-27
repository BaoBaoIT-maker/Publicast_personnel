const express = require('express');
const OrderController = require('../controllers/order.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');
const validations = require('../middlewares/shopping.validation');

const router = express.Router();
const orderController = new OrderController();

// Apply authentication middleware to all routes
router.use(verifyAuth);

// POST /api/orders - Tạo đơn hàng
router.post(
  '/',
  validations.validateCreateOrder,
  (req, res) => orderController.createOrder(req, res)
);

// GET /api/orders - Lấy danh sách đơn hàng
router.get('/', (req, res) => orderController.getMyOrders(req, res));

// GET /api/orders/history - Lấy lịch sử mua hàng
router.get('/history', (req, res) => orderController.getOrderHistory(req, res));

// GET /api/orders/stats - Lấy thống kê chi tiêu
router.get('/stats', (req, res) => orderController.getSpendingStats(req, res));

// GET /api/orders/:orderId - Lấy chi tiết đơn hàng
router.get(
  '/:orderId',
  validations.validateGetOrder,
  (req, res) => orderController.getOrder(req, res)
);

// GET /api/orders/:orderId/can-cancel - Kiểm tra có thể hủy không
router.get(
  '/:orderId/can-cancel',
  validations.validateGetOrder,
  (req, res) => orderController.canCancelOrder(req, res)
);

// DELETE /api/orders/:orderId/cancel - Hủy đơn hàng
router.delete(
  '/:orderId/cancel',
  validations.validateCancelOrder,
  (req, res) => orderController.cancelOrder(req, res)
);

// POST /api/orders/:orderId/cancellation-request - Gửi yêu cầu hủy
router.post(
  '/:orderId/cancellation-request',
  validations.validateRequestCancellation,
  (req, res) => orderController.requestCancellation(req, res)
);

// PUT /api/orders/:orderId/status - Cập nhật trạng thái (ADMIN ONLY)
router.put(
  '/:orderId/status',
  validations.validateUpdateOrderStatus,
  (req, res) => orderController.updateOrderStatus(req, res)
);

module.exports = router;
