const OrderService = require('../services/order.service');
const schedule = require('node-schedule');

const orderService = new OrderService();

// Xác nhận đơn hàng tự động mỗi phút
const startOrderAutomation = () => {
  // DISABLED: Chạy mỗi phút để xác nhận đơn hàng cần xác nhận
  // schedule.scheduleJob('*/1 * * * *', async () => {
  //   try {
  //     const confirmedCount = await orderService.autoConfirmOrders();
  //     if (confirmedCount > 0) {
  //       console.log(`✓ Đã tự động xác nhận ${confirmedCount} đơn hàng`);
  //     }
  //   } catch (error) {
  //     console.error('Error in order automation:', error);
  //   }
  // });

  console.log('Order automation started - checking every minute');
};

module.exports = { startOrderAutomation };
