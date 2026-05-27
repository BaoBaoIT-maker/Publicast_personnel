const { prisma } = require('../config/prisma');

class CartRepository {
  // Lấy giỏ hàng của user
  async getCartByUserId(userId) {
    return prisma.cart.findUnique({
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
    });
  }

  // Lấy hoặc tạo giỏ hàng
  async getOrCreateCart(userId) {
    let cart = await this.getCartByUserId(userId);
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
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
    }
    
    return cart;
  }

  // Thêm sản phẩm vào giỏ hàng
  async addItemToCart(userId, productId, quantity) {
    const cart = await this.getOrCreateCart(userId);

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Cập nhật số lượng
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      });
    }

    // Tạo mục giỏ hàng mới
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
  }

  // Cập nhật số lượng sản phẩm trong giỏ
  async updateCartItemQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      return await this.removeItemFromCart(cartItemId);
    }

    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async removeItemFromCart(cartItemId) {
    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(userId) {
    const cart = await this.getCartByUserId(userId);
    
    if (!cart) {
      return null;
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return cart;
  }

  // Tính tổng tiền giỏ hàng
  async calculateCartTotal(userId) {
    const cart = await this.getCartByUserId(userId);
    
    if (!cart || cart.items.length === 0) {
      return 0;
    }

    const total = cart.items.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return total;
  }

  // Lấy chi tiết giỏ hàng với thông tin tính toán
  async getCartWithDetails(userId) {
    const cart = await this.getCartByUserId(userId);
    
    if (!cart) {
      return null;
    }

    const items = cart.items.map(item => ({
      ...item,
      originalPrice: item.product.price,
      salePrice: item.product.discountPrice || item.product.price,
      discount: item.product.discountPrice 
        ? Math.round(((item.product.price - item.product.discountPrice) / item.product.price) * 100)
        : 0,
      itemTotal: (item.product.discountPrice || item.product.price) * item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.itemTotal, 0);
    const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
    const totalSavings = originalTotal - total;

    return {
      ...cart,
      items,
      total,
      originalTotal,
      totalSavings,
      itemCount: items.length,
    };
  }
}

module.exports = CartRepository;
