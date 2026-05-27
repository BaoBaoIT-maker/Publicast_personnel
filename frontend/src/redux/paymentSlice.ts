import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentAPI } from '../services/paymentAPI';

export interface Payment {
  id: string;
  orderId: string;
  method: string;
  amount: number;
  status: string;
  reference?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentSummary {
  orderId: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: string;
}

export interface PaymentState {
  currentPayment: Payment | null;
  paymentSummary: PaymentSummary | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: PaymentState = {
  currentPayment: null,
  paymentSummary: null,
  loading: false,
  error: null,
  success: null,
};

// Async thunks
export const getPaymentInfo = createAsyncThunk(
  'payment/getPaymentInfo',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentInfo(paymentId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi lấy thông tin thanh toán');
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.confirmPayment(paymentId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi xác nhận thanh toán');
    }
  }
);

export const getPaymentSummary = createAsyncThunk(
  'payment/getPaymentSummary',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentSummary(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi lấy tóm tắt thanh toán');
    }
  }
);

export const refundPayment = createAsyncThunk(
  'payment/refundPayment',
  async ({ paymentId, reason }: { paymentId: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.refundPayment(paymentId, reason);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi khi hoàn tiền');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // getPaymentInfo
    builder
      .addCase(getPaymentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(getPaymentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // confirmPayment
    builder
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Thanh toán đã được xác nhận';
        state.currentPayment = action.payload;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // getPaymentSummary
    builder
      .addCase(getPaymentSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSummary = action.payload;
      })
      .addCase(getPaymentSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // refundPayment
    builder
      .addCase(refundPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Yêu cầu hoàn tiền đã được gửi';
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess } = paymentSlice.actions;
export default paymentSlice.reducer;
