import { axiosInstance } from './axios';

export const paymentAPI = {
  // Lấy thông tin thanh toán
  getPaymentInfo: async (paymentId: string) => {
    const response = await axiosInstance.get(`/payments/${paymentId}`);
    return response.data.data;
  },

  // Lấy thông tin thanh toán của đơn hàng
  getOrderPayment: async (orderId: string) => {
    const response = await axiosInstance.get(`/payments/order/${orderId}`);
    return response.data.data;
  },

  // Xác nhận thanh toán
  confirmPayment: async (paymentId: string) => {
    const response = await axiosInstance.post(`/payments/${paymentId}/confirm`);
    return response.data.data;
  },

  // Lấy tóm tắt thanh toán
  getPaymentSummary: async (orderId: string) => {
    const response = await axiosInstance.get(`/payments/order/${orderId}/summary`);
    return response.data.data;
  },

  // Hoàn tiền
  refundPayment: async (paymentId: string, reason: string) => {
    const response = await axiosInstance.post(`/payments/${paymentId}/refund`, { reason });
    return response.data.data;
  },
};
