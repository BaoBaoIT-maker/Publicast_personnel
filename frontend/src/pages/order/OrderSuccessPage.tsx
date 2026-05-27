import { FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getOrderDetails, clearCurrentOrder } from '../../redux/orderSlice';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderSuccessPage: FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentOrder, detailLoading } = useAppSelector((state) => state.order);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  if (detailLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đơn hàng thành công!</h1>
          <p className="text-gray-600">Cảm ơn bạn đã mua hàng tại PubliCast</p>
        </div>

        {/* Order Summary */}
        {currentOrder && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
              <p className="text-lg font-bold text-blue-600">{currentOrder.orderCode}</p>
            </div>

            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600 mb-2">Sản phẩm</p>
              <div className="space-y-2">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product.name}
                      <span className="text-gray-500"> x{item.quantity}</span>
                    </span>
                    <span className="font-semibold">₫{(item.total ?? (item.price * item.quantity)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600 mb-1">Địa chỉ giao hàng</p>
              <p className="text-sm text-gray-700">{currentOrder.shippingAddress}</p>
              <p className="text-sm text-gray-700 mt-1">{currentOrder.phoneNumber}</p>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Tổng cộng</span>
              <span className="text-2xl font-bold text-red-500">
                ₫{currentOrder.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            <strong>Thông tin:</strong> Đơn hàng sẽ được xác nhận trong 30 phút tới. Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi".
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/order-tracking')}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            <Package size={20} />
            Theo dõi đơn hàng
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            Tiếp tục mua sắm
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Nếu có vấn đề, vui lòng liên hệ với chúng tôi qua{' '}
          <a href="mailto:support@publicast.com" className="text-blue-600 hover:underline">
            support@publicast.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
