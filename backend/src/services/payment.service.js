const { prisma } = require('../config/prisma');

class PaymentService {
  constructor() {
    this.supportedMethods = ['COD'];
  }

  // Validate phương thức thanh toán
  async validatePaymentMethod(method) {
    if (!this.supportedMethods.includes(method)) {
      throw new Error(`Phương thức thanh toán không được hỗ trợ: ${method}`);
    }

    return true;
  }

  // Xử lý thanh toán COD
  async processCODPayment(orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    if (order.paymentMethod !== 'COD') {
      throw new Error('Đơn hàng không sử dụng phương thức COD');
    }

    // Tạo bản ghi thanh toán (nếu cần)
    const payment = await prisma.payment.create({
      data: {
        orderId,
        method: 'COD',
        amount: order.totalPrice,
        status: 'PENDING', // Chờ thanh toán khi giao hàng
        reference: `COD-${orderId.substring(0, 8).toUpperCase()}-${Date.now()}`,
      },
    });

    return {
      success: true,
      message: 'Đơn hàng sẽ được thanh toán khi giao hàng',
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        method: payment.method,
        amount: payment.amount,
        status: payment.status,
        reference: payment.reference,
      },
    };
  }

  // Xác nhận thanh toán (khi giao hàng)
  async confirmPayment(paymentId) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Thanh toán không tồn tại');
    }

    if (payment.status !== 'PENDING') {
      throw new Error('Thanh toán đã được xác nhận');
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Thanh toán đã được xác nhận',
      payment: updatedPayment,
    };
  }

  // Lấy thông tin thanh toán
  async getPaymentInfo(paymentId) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
      },
    });
  }

  // Lấy thanh toán theo orderId
  async getPaymentByOrderId(orderId) {
    return prisma.payment.findUnique({
      where: { orderId },
    });
  }

  // Tính phí vận chuyển (nếu cần)
  async calculateShippingFee(totalPrice, address) {
    // Ví dụ: miễn phí vận chuyển cho đơn hàng > 500k
    if (totalPrice >= 500000) {
      return 0;
    }

    // Phí vận chuyển cơ bản
    const baseFee = 25000;

    // Có thể thêm logic tính toán dựa vào địa chỉ
    return baseFee;
  }

  // Tính tiền giảm giá (nếu có mã khuyến mãi)
  async calculateDiscount(code, totalPrice) {
    if (!code) {
      return 0;
    }

    // Placeholder: có thể tích hợp hệ thống mã khuyến mãi
    // Hiện tại trả về 0
    return 0;
  }

  // Lấy tóm tắt thanh toán
  async getPaymentSummary(orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    const shippingFee = await this.calculateShippingFee(order.totalPrice, order.shippingAddress);

    return {
      orderId: order.id,
      subtotal: order.totalPrice,
      shipping: shippingFee,
      discount: 0,
      total: order.totalPrice + shippingFee,
      paymentMethod: order.paymentMethod,
      status: order.status,
    };
  }

  // Refund (hoàn tiền)
  async refundPayment(paymentId, reason) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Thanh toán không tồn tại');
    }

    if (payment.status !== 'COMPLETED') {
      throw new Error('Chỉ có thể hoàn tiền cho những thanh toán đã hoàn tất');
    }

    const refund = await prisma.refund.create({
      data: {
        paymentId,
        amount: payment.amount,
        reason,
        status: 'PENDING',
      },
    });

    return {
      success: true,
      message: 'Yêu cầu hoàn tiền đã được gửi',
      refund,
    };
  }
}

module.exports = PaymentService;
