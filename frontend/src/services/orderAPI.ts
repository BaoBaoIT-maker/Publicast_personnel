import { axiosInstance } from './axios';

export interface CreateOrderPayload {
  paymentMethod: string;
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
}

export const orderAPI = {
  // Tạo đơn hàng
  createOrder: async (payload: CreateOrderPayload) => {
    const response = await axiosInstance.post('/orders', payload);
    return response.data.data;
  },

  // Lấy danh sách đơn hàng
  getMyOrders: async (status?: string) => {
    const url = status ? `/orders?status=${status}` : '/orders';
    const response = await axiosInstance.get(url);
    return response.data.data;
  },

  // Lấy chi tiết đơn hàng
  getOrderDetails: async (orderId: string) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data.data;
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId: string, reason: string) => {
    const response = await axiosInstance.delete(`/orders/${orderId}/cancel`, {
      data: { reason },
    });
    return response.data.data;
  },

  // Gửi yêu cầu hủy
  requestCancellation: async (orderId: string, reason: string) => {
    const response = await axiosInstance.post(`/orders/${orderId}/cancellation-request`, {
      reason,
    });
    return response.data.data;
  },

  // Kiểm tra có thể hủy không
  canCancelOrder: async (orderId: string) => {
    const response = await axiosInstance.get(`/orders/${orderId}/can-cancel`);
    return response.data.data;
  },

  // Lấy lịch sử mua hàng
  getOrderHistory: async (page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get(`/orders/history?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Lấy thống kê chi tiêu
  getSpendingStats: async () => {
    const response = await axiosInstance.get('/orders/stats');
    return response.data.data;
  },

  // Cập nhật trạng thái (ADMIN)
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, { status });
    return response.data.data;
  },
};
