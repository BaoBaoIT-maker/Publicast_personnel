import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getOrderDetails, cancelOrder, requestCancellation, clearSuccess, clearError } from '../../redux/orderSlice';
import { ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import OrderTrackingTimeline from '../../components/OrderTrackingTimeline';

const OrderDetailPage: FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentOrder, detailLoading, loading, error, success } = useAppSelector((state) => state.order);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelType, setCancelType] = useState<'direct' | 'request' | null>(null);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate('/order-tracking');
      }, 2000);
    }
  }, [success, dispatch, navigate]);

  const handleCancelClick = () => {
    setShowCancelModal(true);
    setCancelReason('');
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy');
      return;
    }

    if (cancelReason.length < 5) {
      alert('Lý do hủy phải có ít nhất 5 ký tự');
      return;
    }

    try {
      if (cancelType === 'direct' && orderId) {
        await dispatch(cancelOrder({ orderId, reason: cancelReason })).unwrap();
      } else if (cancelType === 'request' && orderId) {
        await dispatch(requestCancellation({ orderId, reason: cancelReason })).unwrap();
      }
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  if (detailLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader className="animate-spin" size={32} />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Đơn hàng không tồn tại</p>
          <button
            onClick={() => navigate('/order-tracking')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const canCancel = ['NEW', 'CONFIRMED', 'PREPARING'].includes(currentOrder.statusKey);
  const shouldShowDirect = ['NEW'].includes(currentOrder.statusKey);
  const shouldShowRequest = ['PREPARING'].includes(currentOrder.statusKey);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/order-tracking')}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{currentOrder.orderCode}</h1>
              <p className="text-gray-600 mt-1">
                Đặt hàng lúc {new Date(currentOrder.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
            <div className={`px-4 py-2 rounded font-semibold ${
              currentOrder.statusKey === 'DELIVERED'
                ? 'bg-green-100 text-green-700'
                : currentOrder.statusKey === 'CANCELLED'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {currentOrder.status}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 flex items-start gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => dispatch(clearError())}
                className="mt-2 text-red-600 hover:text-red-700 text-sm underline"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Timeline */}
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-bold mb-4">Trạng thái giao hàng</h2>
              <OrderTrackingTimeline order={currentOrder} />
            </div>

            {/* Order Items */}
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-bold mb-4">Sản phẩm</h2>
              <div className="divide-y">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Giá: ₫{item.price.toLocaleString()}/cái
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">
                        ₫{item.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ nhận hàng</p>
                  <p className="font-semibold">{currentOrder.shippingAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-semibold">{currentOrder.phoneNumber}</p>
                </div>
                {currentOrder.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Ghi chú</p>
                    <p className="font-semibold">{currentOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-lg font-bold mb-4">Tóm tắt</h2>
              <div className="space-y-2 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>₫{currentOrder.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vận chuyển</span>
                  <span>₫0</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">Tổng cộng</span>
                <span className="text-2xl font-bold text-red-500">
                  ₫{currentOrder.totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức</span>
                  <span className="font-semibold">COD</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {canCancel && (
              <div className="bg-white rounded shadow p-6">
                <button
                  onClick={handleCancelClick}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                </button>
              </div>
            )}

            {currentOrder.cancellationRequest && (
              <div className="bg-orange-50 border border-orange-200 rounded p-4">
                <p className="text-orange-700 font-semibold">Yêu cầu hủy đang chờ</p>
                <p className="text-sm text-orange-600 mt-1">
                  Lý do: {currentOrder.cancellationReason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Hủy đơn hàng</h3>

              {shouldShowDirect && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  <p className="font-semibold mb-1">Hủy trực tiếp</p>
                  <p>Đơn hàng này có thể hủy trực tiếp. Sản phẩm sẽ được hoàn lại vào kho.</p>
                </div>
              )}

              {shouldShowRequest && (
                <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                  <p className="font-semibold mb-1">Gửi yêu cầu hủy</p>
                  <p>Đơn hàng này đang được chuẩn bị. Bạn cần gửi yêu cầu hủy cho shop để xác nhận.</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy đơn hàng *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setCancelType(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setCancelType(shouldShowDirect ? 'direct' : 'request');
                    handleCancelSubmit();
                  }}
                  disabled={loading || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
