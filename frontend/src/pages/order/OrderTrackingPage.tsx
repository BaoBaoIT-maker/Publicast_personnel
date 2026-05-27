import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getOrderHistory, getSpendingStats } from '../../redux/orderSlice';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';
import OrderTrackingTimeline from '../../components/OrderTrackingTimeline';

const OrderTrackingPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, stats, pagination, loading } = useAppSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getOrderHistory({ page, limit: 5 }));
    dispatch(getSpendingStats());
  }, [dispatch, page]);

  const currentOrder = orders.find((o) => o.id === selectedOrder) || orders[0];

  const handleRefresh = () => {
    dispatch(getOrderHistory({ page, limit: 5 }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-4">
            <Package size={32} />
            Theo dõi đơn hàng
          </h1>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tổng chi tiêu</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₫{stats.totalSpending.toLocaleString()}
                  </p>
                </div>
                <TrendingUp size={48} className="text-blue-400" />
              </div>
            </div>
            <div className="bg-white rounded shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tổng đơn hàng</p>
                  <p className="text-3xl font-bold text-green-600">{stats.orderCount}</p>
                </div>
                <Package size={48} className="text-green-400" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded shadow overflow-hidden">
              <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2">
                  <Package size={20} />
                  Đơn hàng của tôi
                </h2>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500">Đang tải...</div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>Bạn chưa có đơn hàng nào</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="mt-4 text-blue-500 hover:text-blue-600"
                  >
                    Mua sắm ngay
                  </button>
                </div>
              ) : (
                <div className="divide-y max-h-96 overflow-y-auto">
                  {orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order.id)}
                      className={`w-full text-left p-4 transition ${
                        selectedOrder === order.id || (!selectedOrder && order === orders[0])
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-semibold text-sm">{order.orderCode}</p>
                      <p className={`text-xs mt-1 ${
                        order.statusKey === 'DELIVERED'
                          ? 'text-green-600'
                          : order.statusKey === 'CANCELLED'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}>
                        {order.status}
                      </p>
                      <p className="text-sm text-red-600 font-bold mt-2">
                        ₫{order.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1 || loading}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <p className="text-sm text-gray-600">
                    {page} / {pagination.pages}
                  </p>
                  <button
                    onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                    disabled={page === pagination.pages || loading}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {currentOrder ? (
              <div className="space-y-6">
                {/* Tracking Timeline */}
                <div className="bg-white rounded shadow p-6">
                  <h2 className="text-xl font-bold mb-4">Trạng thái đơn hàng</h2>
                  <OrderTrackingTimeline order={currentOrder} />
                </div>

                {/* Order Items */}
                <div className="bg-white rounded shadow p-6">
                  <h2 className="text-xl font-bold mb-4">Chi tiết sản phẩm</h2>
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
                          <p className="text-sm text-gray-600">
                            {item.quantity} x ₫{item.price.toLocaleString()}
                          </p>
                          <p className="text-lg font-bold text-red-500 mt-2">
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
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Địa chỉ</p>
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
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                      <p className="font-semibold">{currentOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : currentOrder.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded shadow p-6">
                  <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                  <div className="space-y-2 pb-4 border-b">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn hàng</span>
                      <span className="font-semibold">{currentOrder.orderCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đặt</span>
                      <span className="font-semibold">
                        {new Date(currentOrder.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Tổng cộng</span>
                      <span className="text-2xl font-bold text-red-500">
                        ₫{currentOrder.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {['NEW', 'CONFIRMED', 'PREPARING'].includes(currentOrder.statusKey) && (
                    <button
                      onClick={() => navigate(`/order/${currentOrder.id}`)}
                      className="w-full mt-4 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Quản lý đơn hàng
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded shadow p-8 text-center text-gray-500">
                <p>Chọn đơn hàng để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
