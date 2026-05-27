const { prisma } = require('../config/prisma');
const { OrderStatus } = require('@prisma/client');

class OrderRepository {
  // Tạo đơn hàng từ giỏ hàng
  async createOrderFromCart(userId, cartItems, totalPrice, paymentMethod, shippingData) {
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        paymentMethod,
        shippingAddress: shippingData.address,
        phoneNumber: shippingData.phoneNumber,
        notes: shippingData.notes,
        status: OrderStatus.NEW,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.discountPrice || item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return order;
  }

  // Lấy đơn hàng theo ID
  async getOrderById(orderId) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  // Lấy tất cả đơn hàng của user
  async getOrdersByUserId(userId, status = null) {
    const where = { userId };
    
    if (status) {
      where.status = status;
    }

    return prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId, newStatus) {
    const updateData = { status: newStatus };

    // Cập nhật thời gian tương ứng với trạng thái
    switch (newStatus) {
      case OrderStatus.CONFIRMED:
        updateData.confirmedAt = new Date();
        break;
      case OrderStatus.SHIPPING:
        updateData.shippedAt = new Date();
        break;
      case OrderStatus.DELIVERED:
        updateData.deliveredAt = new Date();
        break;
      case OrderStatus.CANCELLED:
        updateData.cancelledAt = new Date();
        break;
    }

    return prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }

  // Yêu cầu hủy đơn hàng
  async requestCancellation(orderId, reason) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLATION_REQUESTED,
        cancellationRequest: true,
        cancellationReason: reason,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Hủy đơn hàng
  async cancelOrder(orderId, reason) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Lấy đơn hàng cần xác nhận (>30 phút)
  async getOrdersNeedingConfirmation() {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const orders = await prisma.order.findMany({
        where: {
          status: OrderStatus.NEW,
          createdAt: {
            lte: thirtyMinutesAgo,
          },
        },
      });

      return orders || [];
    } catch (error) {
      console.error('Error getting orders needing confirmation:', error);
      return [];
    }
  }

  // Kiểm tra xem đơn hàng có thể hủy không
  async canCancelOrder(orderId) {
    const order = await this.getOrderById(orderId);
    
    if (!order) {
      return { canCancel: false, reason: 'Đơn hàng không tồn tại' };
    }

    // Không thể hủy nếu đã giao
    if (order.status === OrderStatus.DELIVERED) {
      return { canCancel: false, reason: 'Đơn hàng đã giao không thể hủy' };
    }

    // Không thể hủy nếu đã hủy
    if (order.status === OrderStatus.CANCELLED) {
      return { canCancel: false, reason: 'Đơn hàng đã bị hủy' };
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const canCancelWithin30Min = order.createdAt >= thirtyMinutesAgo && 
      order.status === OrderStatus.NEW;

    // Nếu trong 30 phút đầu và còn là đơn hàng mới, có thể hủy trực tiếp
    if (canCancelWithin30Min) {
      return { canCancel: true, type: 'direct', reason: 'Có thể hủy trực tiếp' };
    }

    // Ngoài 30 phút, phải gửi yêu cầu hủy cho shop
    if (order.status === OrderStatus.PREPARING) {
      return { canCancel: true, type: 'request', reason: 'Phải gửi yêu cầu hủy cho shop' };
    }

    return { canCancel: false, reason: 'Không thể hủy đơn hàng này' };
  }

  // Lấy lịch sử mua hàng
  async getOrderHistory(userId, limit = 10, offset = 0) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      orders,
      total,
      page: Math.floor(offset / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  }

  // Thống kê tổng chi tiêu của user
  async getUserTotalSpending(userId) {
    const result = await prisma.order.aggregate({
      where: {
        userId,
        status: {
          notIn: [OrderStatus.CANCELLED],
        },
      },
      _sum: {
        totalPrice: true,
      },
      _count: true,
    });

    return {
      totalSpending: result._sum.totalPrice || 0,
      orderCount: result._count || 0,
    };
  }
}

module.exports = OrderRepository;
