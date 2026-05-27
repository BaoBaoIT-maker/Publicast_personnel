import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../services/orderAPI';

export interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderCode: string;
  status: string;
  statusKey: string;
  paymentMethod: string;
  totalPrice: number;
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
  items: OrderItem[];
  cancellationRequest: boolean;
  cancellationReason?: string;
  createdAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  success: string | null;
  pagination?: {
    page: number;
    pages: number;
    total: number;
    perPage: number;
  };
  stats?: {
    totalSpending: number;
    orderCount: number;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  detailLoading: false,
  error: null,
  success: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (
    {
      paymentMethod,
      shippingAddress,
      phoneNumber,
      notes,
    }: {
      paymentMethod: string;
      shippingAddress: string;
      phoneNumber: string;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderAPI.createOrder({
        paymentMethod,
        shippingAddress,
        phoneNumber,
        notes,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi tạo đơn hàng');
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (status?: string, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getMyOrders(status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi lấy danh sách đơn hàng');
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderDetails(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi lấy chi tiết đơn hàng');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async ({ orderId, reason }: { orderId: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(orderId, reason);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi hủy đơn hàng');
    }
  }
);

export const requestCancellation = createAsyncThunk(
  'order/requestCancellation',
  async ({ orderId, reason }: { orderId: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.requestCancellation(orderId, reason);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi gửi yêu cầu hủy');
    }
  }
);

export const canCancelOrder = createAsyncThunk(
  'order/canCancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderAPI.canCancelOrder(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi kiểm tra trạng thái');
    }
  }
);

export const getOrderHistory = createAsyncThunk(
  'order/getOrderHistory',
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await orderAPI.getOrderHistory(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi lấy lịch sử mua hàng');
    }
  }
);

export const getSpendingStats = createAsyncThunk(
  'order/getSpendingStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getSpendingStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi lấy thống kê');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Tạo đơn hàng thành công';
        state.currentOrder = action.payload.order;
        state.orders.unshift(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // getMyOrders
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // getOrderDetails
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });

    // cancelOrder
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Hủy đơn hàng thành công';
        if (state.currentOrder) {
          state.currentOrder = action.payload;
        }
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // requestCancellation
    builder
      .addCase(requestCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(requestCancellation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Yêu cầu hủy đã được gửi';
        if (state.currentOrder) {
          state.currentOrder = action.payload;
        }
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(requestCancellation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // getOrderHistory
    builder
      .addCase(getOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // getSpendingStats
    builder
      .addCase(getSpendingStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSpendingStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getSpendingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
