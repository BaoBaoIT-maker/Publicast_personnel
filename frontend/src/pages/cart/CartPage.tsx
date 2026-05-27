import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCart, clearError, CartItem } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import CartItemComponent from '../../components/CartItem';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const CartPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, summary, loading, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    navigate('/checkout');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Lỗi: {error}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={20} />
            Tiếp tục mua hàng
          </button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart size={32} />
            Giỏ hàng của bạn
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded shadow p-8 text-center">
                <p className="text-gray-500">Đang tải...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded shadow p-8 text-center">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">Giỏ hàng của bạn trống</p>
                <button
                  onClick={() => navigate('/products')}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Mua ngay
                </button>
              </div>
            ) : (
              <div className="bg-white rounded shadow">
                {items.map((item: CartItem) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Số sản phẩm</span>
                <span className="font-semibold">{summary.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-semibold">₫{summary.originalTotal.toLocaleString()}</span>
              </div>
              {summary.totalSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Tiết kiệm</span>
                  <span>-₫{summary.totalSavings.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <span className="text-lg font-bold">Tổng cộng</span>
              <span className="text-2xl font-bold text-red-500">
                ₫{summary.total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={items.length === 0 || loading}
              className="w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiến hành thanh toán
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full mt-3 border border-gray-300 py-2 rounded hover:bg-gray-50 transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
