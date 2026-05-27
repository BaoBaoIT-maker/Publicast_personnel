import { FC, useState } from 'react';
import { Package, Truck, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

interface OrderTracking {
  id: string;
  statusKey: string;
  status: string;
  createdAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

interface OrderTrackingTimelineProps {
  order: OrderTracking;
}

const OrderTrackingTimeline: FC<OrderTrackingTimelineProps> = ({ order }) => {
  const steps = [
    {
      key: 'NEW',
      label: 'Đơn hàng mới',
      icon: Package,
      date: order.createdAt,
      completed: order.statusKey !== 'NEW' && order.statusKey !== 'CANCELLED',
    },
    {
      key: 'CONFIRMED',
      label: 'Đã xác nhận',
      icon: CheckCircle,
      date: order.confirmedAt,
      completed: ['CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED'].includes(order.statusKey),
    },
    {
      key: 'PREPARING',
      label: 'Shop đang chuẩn bị',
      icon: Package,
      date: order.shippedAt,
      completed: ['SHIPPING', 'DELIVERED'].includes(order.statusKey),
    },
    {
      key: 'SHIPPING',
      label: 'Đang giao hàng',
      icon: Truck,
      date: order.shippedAt,
      completed: order.statusKey === 'DELIVERED',
    },
    {
      key: 'DELIVERED',
      label: 'Đã giao thành công',
      icon: MapPin,
      date: order.deliveredAt,
      completed: order.statusKey === 'DELIVERED',
    },
  ];

  const getStatusColor = () => {
    switch (order.statusKey) {
      case 'DELIVERED':
        return 'text-green-500';
      case 'CANCELLED':
        return 'text-red-500';
      case 'CANCELLATION_REQUESTED':
        return 'text-orange-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className={`p-4 rounded ${getStatusColor()} bg-opacity-10 border-l-4 ${getStatusColor()} border-opacity-50`}>
        <p className={`font-semibold ${getStatusColor()}`}>{order.status}</p>
        {order.statusKey === 'CANCELLATION_REQUESTED' && (
          <p className="text-sm text-gray-600 mt-1">Đang chờ shop xác nhận yêu cầu hủy</p>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === order.statusKey;
          const isCancelled = order.statusKey === 'CANCELLED';

          if (isCancelled && step.key !== 'NEW' && step.key !== 'CONFIRMED') {
            return null;
          }

          return (
            <div key={step.key} className="flex gap-4 pb-8">
              {/* Timeline marker */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    step.completed ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                >
                  <Icon size={24} className={step.completed || isActive ? 'text-white' : 'text-gray-500'} />
                </div>
                {/* Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-1 h-16 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pt-2 pb-6">
                <p className={`font-semibold ${step.completed ? 'text-gray-700' : isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Clock size={14} />
                    {new Date(step.date).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Cancelled state */}
        {order.statusKey === 'CANCELLED' && (
          <div className="flex gap-4 pb-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500">
                <XCircle size={24} className="text-white" />
              </div>
            </div>
            <div className="pt-2">
              <p className="font-semibold text-red-600">Đã hủy</p>
              {order.cancelledAt && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <Clock size={14} />
                  {new Date(order.cancelledAt).toLocaleString('vi-VN')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingTimeline;
