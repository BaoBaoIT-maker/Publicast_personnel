# Hướng Dẫn Sử Dụng Chức Năng Mua Hàng

## Tổng Quan

Ứng dụng PubliCast đã được tích hợp 3 chức năng chính cho hệ thống bán hàng:

1. **🛒 Giỏ Hàng (Shopping Cart)**
2. **💳 Thanh Toán (Checkout)**
3. **📦 Theo Dõi Đơn Hàng (Order Tracking)**

---

## 1. Giỏ Hàng (Shopping Cart)

### API Endpoints

#### Lấy giỏ hàng

```bash
GET /api/cart
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "item-id",
        "product": {
          "id": "product-id",
          "name": "Sản phẩm",
          "price": 100000,
          "salePrice": 90000,
          "discount": 10,
          "image": "url"
        },
        "quantity": 2,
        "itemTotal": 180000
      }
    ],
    "summary": {
      "itemCount": 1,
      "total": 180000,
      "originalTotal": 200000,
      "totalSavings": 20000
    }
  }
}
```

#### Thêm sản phẩm vào giỏ

```bash
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-id",
  "quantity": 1
}
```

#### Cập nhật số lượng

```bash
PUT /api/cart/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Xóa sản phẩm khỏi giỏ

```bash
DELETE /api/cart/:itemId
Authorization: Bearer <token>
```

#### Xóa toàn bộ giỏ hàng

```bash
DELETE /api/cart
Authorization: Bearer <token>
```

### Frontend

- **Trang Cart:** `/cart`
- **Redux Store:** `store.cart`
- **Components:**
  - `CartPage` - Trang giỏ hàng chính
  - `CartItem` - Component hiển thị item trong giỏ

---

## 2. Thanh Toán (Checkout)

### API Endpoints

#### Tạo đơn hàng

```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "COD",
  "shippingAddress": "123 Đường ABC, Quận XYZ, TP HCM",
  "phoneNumber": "0912345678",
  "notes": "Ghi chú thêm (tùy chọn)"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đơn hàng được tạo thành công",
  "data": {
    "order": {
      "id": "order-id",
      "orderCode": "ORD-ABC123D",
      "status": "Đơn hàng mới",
      "totalPrice": 180000,
      "items": [...]
    },
    "payment": {
      "id": "payment-id",
      "method": "COD",
      "amount": 180000,
      "status": "PENDING"
    }
  }
}
```

#### Lấy tóm tắt thanh toán

```bash
GET /api/payments/order/:orderId/summary
Authorization: Bearer <token>
```

### Frontend

- **Trang Checkout:** `/checkout`
- **Redux Store:** `store.payment`
- **Components:**
  - `CheckoutPage` - Trang thanh toán
  - `OrderSuccessPage` - Trang thành công

### Trạng Thái Thanh Toán

| Status    | Mô Tả                |
| --------- | -------------------- |
| PENDING   | Chờ thanh toán (COD) |
| COMPLETED | Đã thanh toán        |
| FAILED    | Thanh toán thất bại  |
| REFUNDED  | Đã hoàn tiền         |

---

## 3. Theo Dõi Đơn Hàng (Order Tracking)

### API Endpoints

#### Lấy danh sách đơn hàng

```bash
GET /api/orders
GET /api/orders?status=CONFIRMED
Authorization: Bearer <token>
```

#### Lấy chi tiết đơn hàng

```bash
GET /api/orders/:orderId
Authorization: Bearer <token>
```

#### Lấy lịch sử mua hàng

```bash
GET /api/orders/history?page=1&limit=10
Authorization: Bearer <token>
```

#### Lấy thống kê chi tiêu

```bash
GET /api/orders/stats
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalSpending": 1000000,
    "orderCount": 5
  }
}
```

#### Kiểm tra có thể hủy đơn hàng không

```bash
GET /api/orders/:orderId/can-cancel
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "canCancel": true,
    "type": "direct",
    "reason": "Có thể hủy trực tiếp"
  }
}
```

#### Hủy đơn hàng

```bash
DELETE /api/orders/:orderId/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Lý do hủy"
}
```

#### Gửi yêu cầu hủy cho shop

```bash
POST /api/orders/:orderId/cancellation-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Lý do hủy"
}
```

### Frontend

- **Trang Order Tracking:** `/order-tracking`
- **Trang Chi Tiết Đơn Hàng:** `/order/:orderId`
- **Redux Store:** `store.order`
- **Components:**
  - `OrderTrackingPage` - Trang theo dõi đơn hàng
  - `OrderDetailPage` - Trang chi tiết đơn hàng
  - `OrderTrackingTimeline` - Component hiển thị timeline trạng thái

### Trạng Thái Đơn Hàng

| Status                 | Mô Tả                             |
| ---------------------- | --------------------------------- |
| NEW                    | Đơn hàng mới (chờ xác nhận)       |
| CONFIRMED              | Đã xác nhận (tự động sau 30 phút) |
| PREPARING              | Shop đang chuẩn bị hàng           |
| SHIPPING               | Đang giao hàng                    |
| DELIVERED              | Đã giao thành công                |
| CANCELLED              | Đã hủy                            |
| CANCELLATION_REQUESTED | Yêu cầu hủy chờ xác nhận          |

### Quy Tắc Hủy Đơn Hàng

1. **Hủy Trực Tiếp:**
   - Chỉ áp dụng cho đơn hàng mới (NEW status)
   - Trong vòng 30 phút đầu sau khi đặt
   - Sản phẩm được hoàn lại kho ngay lập tức

2. **Gửi Yêu Cầu Hủy:**
   - Dùng cho đơn hàng đang chuẩn bị (PREPARING status)
   - Yêu cầu được gửi tới shop để xử lý
   - Shop sẽ quyết định chấp nhận hay từ chối

3. **Không Thể Hủy:**
   - Đơn hàng đã giao (DELIVERED)
   - Đơn hàng đã hủy (CANCELLED)

### Xác Nhận Tự Động

Hệ thống sẽ tự động xác nhận đơn hàng sau 30 phút từ lúc đặt nếu chưa được xác nhận thủ công.

```javascript
// Được xử lý bởi order-automation.js
// Chạy mỗi phút để kiểm tra các đơn hàng cần xác nhận
schedule.scheduleJob("*/1 * * * *", async () => {
  const confirmedCount = await orderService.autoConfirmOrders();
});
```

---

## Database Schema

### Cart Model

```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    String     @unique
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  productId String
  quantity  Int
  cart      Cart     @relation(fields: [cartId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}
```

### Order Model

```prisma
model Order {
  id                   String       @id @default(uuid())
  userId               String
  totalPrice           Float
  status               OrderStatus
  paymentMethod        PaymentMethod
  shippingAddress      String?
  phoneNumber          String?
  notes                String?
  confirmedAt          DateTime?
  shippedAt            DateTime?
  deliveredAt          DateTime?
  cancelledAt          DateTime?
  cancellationReason   String?
  cancellationRequest  Boolean      @default(false)
  items                OrderItem[]
  payment              Payment?
}
```

---

## Redux Store Structure

### Cart State

```typescript
{
  items: CartItem[],
  summary: {
    itemCount: number,
    total: number,
    originalTotal: number,
    totalSavings: number
  },
  loading: boolean,
  error: string | null
}
```

### Order State

```typescript
{
  orders: Order[],
  currentOrder: Order | null,
  loading: boolean,
  detailLoading: boolean,
  error: string | null,
  success: string | null,
  pagination?: {
    page: number,
    pages: number,
    total: number
  },
  stats?: {
    totalSpending: number,
    orderCount: number
  }
}
```

### Payment State

```typescript
{
  currentPayment: Payment | null,
  paymentSummary: PaymentSummary | null,
  loading: boolean,
  error: string | null,
  success: string | null
}
```

---

## Validation Rules

### Tạo Đơn Hàng

- `paymentMethod` - Bắt buộc, phải là COD
- `shippingAddress` - Bắt buộc, tối thiểu 10 ký tự
- `phoneNumber` - Bắt buộc, định dạng SĐT VN hợp lệ
- `notes` - Tùy chọn, tối đa 500 ký tự

### Hủy Đơn Hàng

- `reason` - Bắt buộc, từ 5 đến 500 ký tự

---

## Tính Năng Nổi Bật

✅ Quản lý giỏ hàng với tính toán giá thực thời
✅ Thanh toán COD an toàn
✅ Xác nhận đơn hàng tự động sau 30 phút
✅ Theo dõi trạng thái đơn hàng chi tiết
✅ Lịch sử mua hàng đầy đủ
✅ Thống kê chi tiêu của user
✅ Hủy đơn hàng linh hoạt (trực tiếp hoặc gửi yêu cầu)
✅ Giao diện user-friendly với React/TypeScript
✅ State management với Redux Toolkit
✅ API RESTful chuẩn

---

## Lỗi Thường Gặp & Giải Pháp

### Lỗi: "Sản phẩm không đủ trong kho"

**Giải Pháp:** Kiểm tra lại số lượng sản phẩm hiện có, hoặc chọn số lượng ít hơn

### Lỗi: "Không thể hủy đơn hàng này"

**Giải Pháp:**

- Nếu đơn hàng > 30 phút, dùng "Gửi yêu cầu hủy" thay vì "Hủy trực tiếp"
- Nếu đơn hàng đã giao, không thể hủy

### Lỗi: "Giỏ hàng trống"

**Giải Pháp:** Thêm sản phẩm vào giỏ trước khi thanh toán

---

## Hướng Phát Triển

🔄 **Tích hợp Payment Gateway** (Stripe, PayPal, VNPay)
🔄 **Hệ thống Mã Khuyến Mãi**
🔄 **Đánh Giá Sản Phẩm & Review**
🔄 **Wishlist/Yêu Thích**
🔄 **Tracking Real-time với WebSocket**
🔄 **Notification System**

---

**Cập nhật lần cuối:** 27/05/2026
**Phiên bản:** 1.0.0
