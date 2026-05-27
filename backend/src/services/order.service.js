const OrderRepository = require('../repositories/order.repository');
const CartRepository = require('../repositories/cart.repository');
const { prisma } = require('../config/prisma');
const { OrderStatus } = require('@prisma/client');

class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.cartRepository = new CartRepository();
  }

  // Tạo đơn hàng từ giỏ hàng
  async createOrder(userId, paymentMethod, shippingData) {
    // Validate giỏ hàng
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    // Kiểm tra tồn kho
    for (const item of cart.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Sản phẩm không tồn tại`);
      }

      if (item.quantity > product.stock) {
        throw new Error(`Sản phẩm ${product.name} không đủ trong kho`);
      }
    }

    // Tính tổng tiền
    const totalPrice = await this.cartRepository.calculateCartTotal(userId);

    // Tạo đơn hàng
    const order = await this.orderRepository.createOrderFromCart(
      userId,
      cart.items,
      totalPrice,
      paymentMethod,
      shippingData
    );

    // Cập nhật số lượng sản phẩm đã bán
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          sold: {
            increment: item.quantity,
          },
        },
      });
    }

    // Xóa giỏ hàng
    await this.cartRepository.clearCart(userId);

    return this.formatOrderForDisplay(order);
  }

  // Lấy chi tiết đơn hàng
  async getOrderDetails(orderId, userId) {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order || order.userId !== userId) {
      throw new Error('Đơn hàng không tồn tại');
    }

    return this.formatOrderForDisplay(order);
  }

  // Lấy danh sách đơn hàng của user
  async getMyOrders(userId, status = null) {
    const orders = await this.orderRepository.getOrdersByUserId(userId, status);
    
    return orders.map(order => this.formatOrderForDisplay(order));
  }

  // Xác nhận đơn hàng (tự động sau 30 phút)
  async confirmOrder(orderId) {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    if (order.status !== OrderStatus.NEW) {
      throw new Error('Chỉ có thể xác nhận đơn hàng mới');
    }

    return await this.orderRepository.updateOrderStatus(orderId, OrderStatus.CONFIRMED);
  }

  // Cập nhật trạng thái đơn hàng (admin)
  async updateOrderStatus(orderId, newStatus) {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    return await this.orderRepository.updateOrderStatus(orderId, newStatus);
  }

  // Hủy đơn hàng
  async cancelOrder(orderId, userId, reason) {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order || order.userId !== userId) {
      throw new Error('Đơn hàng không tồn tại');
    }

    const canCancel = await this.orderRepository.canCancelOrder(orderId);

    if (!canCancel.canCancel) {
      throw new Error(canCancel.reason);
    }

    if (canCancel.type === 'direct') {
      // Hủy trực tiếp
      const cancelledOrder = await this.orderRepository.cancelOrder(orderId, reason);

      // Hoàn lại số lượng sản phẩm
      for (const item of cancelledOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            sold: {
              decrement: item.quantity,
            },
          },
        });
      }

      return cancelledOrder;
    } else if (canCancel.type === 'request') {
      // Gửi yêu cầu hủy cho shop
      return await this.orderRepository.requestCancellation(orderId, reason);
    }

    throw new Error('Không thể hủy đơn hàng này');
  }

  // Gửi yêu cầu hủy cho shop
  async requestCancellation(orderId, userId, reason) {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order || order.userId !== userId) {
      throw new Error('Đơn hàng không tồn tại');
    }

    if (order.status !== OrderStatus.PREPARING) {
      throw new Error('Chỉ có thể gửi yêu cầu hủy cho đơn hàng đang chuẩn bị');
    }

    return await this.orderRepository.requestCancellation(orderId, reason);
  }

  // Xử lý xác nhận đơn hàng tự động (chạy mỗi phút)
  async autoConfirmOrders() {
    const orders = await this.orderRepository.getOrdersNeedingConfirmation();

    if (!orders || !Array.isArray(orders)) {
      return 0;
    }

    for (const order of orders) {
      await this.orderRepository.updateOrderStatus(order.id, OrderStatus.CONFIRMED);
    }

    return orders.length;
  }

  // Lấy lịch sử mua hàng
  async getOrderHistory(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const history = await this.orderRepository.getOrderHistory(userId, limit, offset);

    return {
      orders: history.orders.map(order => this.formatOrderForDisplay(order)),
      pagination: {
        page: history.page,
        pages: history.pages,
        total: history.total,
        perPage: limit,
      },
    };
  }

  // Lấy thống kê chi tiêu
  async getSpendingStats(userId) {
    return await this.orderRepository.getUserTotalSpending(userId);
  }

  // Format đơn hàng để hiển thị
  formatOrderForDisplay(order) {
    return {
      id: order.id,
      orderCode: `ORD-${order.id.substring(0, 8).toUpperCase()}`,
      status: this.getOrderStatusDisplay(order.status),
      statusKey: order.status,
      paymentMethod: order.paymentMethod,
      totalPrice: order.totalPrice,
      shippingAddress: order.shippingAddress,
      phoneNumber: order.phoneNumber,
      notes: order.notes,
      items: order.items.map(item => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.images?.[0]?.imageUrl,
        },
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      cancellationRequest: order.cancellationRequest,
      cancellationReason: order.cancellationReason,
      createdAt: order.createdAt,
      confirmedAt: order.confirmedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
    };
  }

  // Lấy hiển thị trạng thái
  getOrderStatusDisplay(status) {
    const statusMap = {
      NEW: 'Đơn hàng mới',
      CONFIRMED: 'Đã xác nhận',
      PREPARING: 'Shop đang chuẩn bị',
      SHIPPING: 'Đang giao hàng',
      DELIVERED: 'Đã giao thành công',
      CANCELLED: 'Đã hủy',
      CANCELLATION_REQUESTED: 'Yêu cầu hủy',
    };

    return statusMap[status] || status;
  }

  // Kiểm tra có thể hủy không
  async canCancelOrder(orderId, userId) {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order || order.userId !== userId) {
      throw new Error('Đơn hàng không tồn tại');
    }

    const canCancel = await this.orderRepository.canCancelOrder(orderId);

    return {
      canCancel: canCancel.canCancel,
      type: canCancel.type,
      reason: canCancel.reason,
    };
  }
}

module.exports = OrderService;
