const CartRepository = require('../repositories/cart.repository');
const { prisma } = require('../config/prisma');

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  // Lấy giỏ hàng
  async getCart(userId) {
    const cart = await this.cartRepository.getCartWithDetails(userId);
    
    if (!cart) {
      return {
        items: [],
        total: 0,
        originalTotal: 0,
        totalSavings: 0,
        itemCount: 0,
      };
    }

    return cart;
  }

  // Thêm sản phẩm vào giỏ
  async addToCart(userId, productId, quantity = 1) {
    // Kiểm tra sản phẩm tồn tại
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    if (quantity <= 0) {
      throw new Error('Số lượng phải lớn hơn 0');
    }

    if (quantity > product.stock) {
      throw new Error(`Chỉ còn ${product.stock} sản phẩm trong kho`);
    }

    await this.cartRepository.addItemToCart(userId, productId, quantity);
    
    return await this.getCartForDisplay(userId);
  }

  // Cập nhật số lượng sản phẩm
  async updateCartItem(userId, cartItemId, quantity) {
    // Kiểm tra cartItem thuộc về user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true, product: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error('Mục giỏ hàng không tồn tại');
    }

    if (quantity <= 0) {
      throw new Error('Số lượng phải lớn hơn 0');
    }

    if (quantity > cartItem.product.stock) {
      throw new Error(`Chỉ còn ${cartItem.product.stock} sản phẩm trong kho`);
    }

    await this.cartRepository.updateCartItemQuantity(cartItemId, quantity);
    
    return await this.getCartForDisplay(userId);
  }

  // Xóa sản phẩm khỏi giỏ
  async removeFromCart(userId, cartItemId) {
    // Kiểm tra cartItem thuộc về user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error('Mục giỏ hàng không tồn tại');
    }

    await this.cartRepository.removeItemFromCart(cartItemId);
    
    return await this.getCartForDisplay(userId);
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(userId) {
    await this.cartRepository.clearCart(userId);
    
    return {
      items: [],
      total: 0,
      originalTotal: 0,
      totalSavings: 0,
      itemCount: 0,
    };
  }

  // Validate giỏ hàng trước checkout
  async validateCart(userId) {
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    // Kiểm tra tồn kho của từng sản phẩm
    for (const item of cart.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Sản phẩm ${item.product.name} không tồn tại`);
      }

      if (item.quantity > product.stock) {
        throw new Error(
          `Sản phẩm ${product.name} chỉ còn ${product.stock} cái, bạn yêu cầu ${item.quantity}`
        );
      }
    }

    return true;
  }

  // Lấy thông tin để hiển thị giỏ hàng
  async getCartForDisplay(userId) {
    const cart = await this.getCart(userId);
    
    return {
      items: cart.items.map(item => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.originalPrice,
          salePrice: item.salePrice,
          discount: item.discount,
          image: item.product.images?.[0]?.imageUrl,
          stock: item.product.stock,
        },
        quantity: item.quantity,
        itemTotal: item.itemTotal,
      })),
      summary: {
        itemCount: cart.itemCount,
        total: cart.total,
        originalTotal: cart.originalTotal,
        totalSavings: cart.totalSavings,
      },
    };
  }
}

module.exports = CartService;
