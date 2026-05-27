const { body, param, query } = require('express-validator');

// Validation cho thêm sản phẩm vào giỏ
const validateAddToCart = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID là bắt buộc')
    .isUUID()
    .withMessage('Product ID không hợp lệ'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity là bắt buộc')
    .isInt({ min: 1 })
    .withMessage('Quantity phải là số nguyên dương'),
];

// Validation cho cập nhật số lượng
const validateUpdateCartItem = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID là bắt buộc')
    .isUUID()
    .withMessage('Item ID không hợp lệ'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity là bắt buộc')
    .isInt({ min: 1 })
    .withMessage('Quantity phải là số nguyên dương'),
];

// Validation cho xóa sản phẩm khỏi giỏ
const validateRemoveFromCart = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID là bắt buộc')
    .isUUID()
    .withMessage('Item ID không hợp lệ'),
];

// Validation cho tạo đơn hàng
const validateCreateOrder = [
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method là bắt buộc')
    .isIn(['COD', 'WALLET', 'CREDIT_CARD', 'BANK_TRANSFER'])
    .withMessage('Payment method không hợp lệ'),
  body('shippingAddress')
    .notEmpty()
    .withMessage('Shipping address là bắt buộc')
    .isLength({ min: 10 })
    .withMessage('Shipping address phải có ít nhất 10 ký tự'),
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number là bắt buộc')
    .matches(/^(\+84|0)[0-9]{9,10}$/)
    .withMessage('Phone number không hợp lệ'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes không được vượt quá 500 ký tự'),
];

// Validation cho cập nhật trạng thái đơn hàng
const validateUpdateOrderStatus = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID là bắt buộc')
    .isUUID()
    .withMessage('Order ID không hợp lệ'),
  body('status')
    .notEmpty()
    .withMessage('Status là bắt buộc')
    .isIn(['CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED'])
    .withMessage('Status không hợp lệ'),
];

// Validation cho hủy đơn hàng
const validateCancelOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID là bắt buộc')
    .isUUID()
    .withMessage('Order ID không hợp lệ'),
  body('reason')
    .notEmpty()
    .withMessage('Reason là bắt buộc')
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason phải từ 5 đến 500 ký tự'),
];

// Validation cho gửi yêu cầu hủy
const validateRequestCancellation = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID là bắt buộc')
    .isUUID()
    .withMessage('Order ID không hợp lệ'),
  body('reason')
    .notEmpty()
    .withMessage('Reason là bắt buộc')
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason phải từ 5 đến 500 ký tự'),
];

// Validation cho lấy order
const validateGetOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID là bắt buộc')
    .isUUID()
    .withMessage('Order ID không hợp lệ'),
];

// Validation cho hoàn tiền
const validateRefundPayment = [
  param('paymentId')
    .notEmpty()
    .withMessage('Payment ID là bắt buộc')
    .isUUID()
    .withMessage('Payment ID không hợp lệ'),
  body('reason')
    .notEmpty()
    .withMessage('Reason là bắt buộc')
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason phải từ 5 đến 500 ký tự'),
];

module.exports = {
  validateAddToCart,
  validateUpdateCartItem,
  validateRemoveFromCart,
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateCancelOrder,
  validateRequestCancellation,
  validateGetOrder,
  validateRefundPayment,
};
