import { FC, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createOrder, clearError as clearOrderError } from '../../redux/orderSlice';
import { getCart, CartItem } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ArrowLeft } from 'lucide-react';

interface FormData {
  shippingAddress: string;
  phoneNumber: string;
  notes: string;
  paymentMethod: string;
}

const CheckoutPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, summary } = useAppSelector((state) => state.cart);
  const { loading, error } = useAppSelector((state) => state.order);
  const [formData, setFormData] = useState<FormData>({
    shippingAddress: '',
    phoneNumber: '',
    notes: '',
    paymentMethod: 'COD',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Lấy giỏ hàng nếu trống
    if (items.length === 0) {
      dispatch(getCart());
    }
  }, [dispatch, items.length]);

  // Nếu giỏ hàng trống, redirect về cart
  useEffect(() => {
    if (!loading && items.length === 0) {
      navigate('/cart');
    }
  }, [items, loading, navigate]);

  const validateForm = () => {
    if (!formData.shippingAddress.trim()) {
      setFormError('Vui lòng nhập địa chỉ giao hàng');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setFormError('Vui lòng nhập số điện thoại');
      return false;
    }
    // Validate phone number format
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setFormError('Số điện thoại không hợp lệ');
      return false;
    }
    if (formData.shippingAddress.length < 10) {
      setFormError('Địa chỉ giao hàng phải có ít nhất 10 ký tự');
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(
        createOrder({
          paymentMethod: formData.paymentMethod,
          shippingAddress: formData.shippingAddress,
          phoneNumber: formData.phoneNumber,
          notes: formData.notes,
        })
      ).unwrap();

      // Navigate to order success page
      navigate(`/order-success/${result.order.id}`);
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  if (items.length === 0 && !loading) {
    return null; // Sẽ redirect về cart
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={20} />
            Quay lại giỏ hàng
          </button>
          <h1 className="text-3xl font-bold">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Truck size={24} />
                  Địa chỉ giao hàng
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ nhận hàng *
                    </label>
                    <textarea
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ đầy đủ..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="VD: 0912345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Ghi chú thêm về đơn hàng..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard size={24} />
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:bg-blue-50 checked:border-blue-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-semibold">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-gray-600">Bạn sẽ thanh toán khi nhận được hàng</p>
                    </div>
                  </label>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                    Hiện tại chúng tôi hỗ trợ phương thức thanh toán COD. Các phương thức khác sẽ được cập nhật sớm.
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {(formError || error) && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-700">{formError || error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-4 mb-4 pb-4 border-b max-h-80 overflow-y-auto">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium line-clamp-2">{item.product.name}</p>
                    <p className="text-gray-600">
                      {item.quantity} x ₫{item.product.salePrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>₫{summary.originalTotal.toLocaleString()}</span>
              </div>
              {summary.totalSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Tiết kiệm</span>
                  <span>-₫{summary.totalSavings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>₫0</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="font-bold">Tổng cộng</span>
              <span className="text-2xl font-bold text-red-500">
                ₫{summary.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
