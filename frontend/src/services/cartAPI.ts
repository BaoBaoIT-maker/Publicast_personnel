import { axiosInstance } from './axios';

export const cartAPI = {
  // Lấy giỏ hàng
  getCart: async () => {
    const response = await axiosInstance.get('/cart');
    return response.data.data;
  },

  // Thêm sản phẩm vào giỏ
  addToCart: async (productId: string, quantity: number) => {
    try {
      const response = await axiosInstance.post('/cart', { productId, quantity });
      return response.data.data;
    } catch (error: any) {
      // Re-throw so the caller (cartSlice) can access error.response
      throw error;
    }
  },

  // Cập nhật số lượng
  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await axiosInstance.put(`/cart/${itemId}`, { quantity });
    return response.data.data;
  },

  // Xóa sản phẩm khỏi giỏ
  removeFromCart: async (itemId: string) => {
    const response = await axiosInstance.delete(`/cart/${itemId}`);
    return response.data.data;
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    const response = await axiosInstance.delete('/cart');
    return response.data.data;
  },
};
