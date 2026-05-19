# Publicast Personnel - Login

---

## Bài 2 - Backend Login API

### Những file đã tạo:

- `backend/src/controllers/auth.controller.js` - Xử lý login request
- `backend/src/services/auth.service.js` - Logic xác thực JWT, kiểm tra password
- `backend/src/routes/auth.routes.js` - Endpoint POST /api/auth/login
- `backend/src/repositories/user.repository.js` - Truy vấn database lấy user
- `backend/src/middlewares/auth.middleware.js` - Verify JWT token
- `backend/src/middlewares/login-rate-limit.middleware.js` - Rate limiting đăng nhập

### Những gì đã làm:

- Validation email/password
- Rate limiting (5 lần sai trong 15 phút)
- JWT Token (access + refresh token)
- Authorization middleware (kiểm tra role user/admin)
- Hashing password bcryptjs
- 2 đường dẫn profile: `/user/profile` (user) và `/admin/profile` (admin)

---

## Bài 3 - UI Login

### Những file đã tạo:

- `frontend/src/pages/auth/Login.tsx` - Trang đăng nhập
- `frontend/src/components/ui/FormInput.tsx` - Component input
- `frontend/src/features/auth/authAPI.ts` - Gọi API login
- `frontend/src/features/auth/authSlice.ts` - Redux state management

### Những gì đã làm:

- Giao diện form đăng nhập
- TailwindCSS styling
- Axios gọi API backend
- Redux Hook quản lý state (loading, error, user data)
- Lưu token vào localStorage
- Redirect sau khi login thành công

---

## Bài 4

### Những file đã tạo:

- `backend/src/controllers/product.controller.js` - Xử lý product requests
- `backend/src/repositories/product.repository.js` - Truy vấn database lấy products
- `backend/src/routes/product.routes.js` - Endpoints /api/products, /api/categories
- `frontend/src/pages/product/ProductDetailPage.tsx` - Trang chi tiết sản phẩm
- `frontend/src/components/ProductCard.tsx` - Component thẻ sản phẩm
- `frontend/src/components/Layout.tsx` - Header & Footer tái sử dụng
- `frontend/src/pages/about/AboutPage.tsx` - Trang giới thiệu công ty

### Những gì đã làm:

- Lấy danh sách sản phẩm từ database
- Lấy chi tiết 1 sản phẩm + review + sản phẩm tương tự
- Lấy danh mục sản phẩm
- Hiển thị hình ảnh (Swiper carousel)
- Hiển thị giá, đồng giá, phần trăm chiết khấu
- Hiển thị rating sao và số lượng bán
- Nút "Xem chi tiết" và "Thêm vào giỏ hàng"
- Tìm kiếm real-time theo tên và mô tả sản phẩm
- Lọc theo khoảng giá (Tất cả/0-100K/100K-200K/200K-500K/500K+)
- Lọc theo danh mục sản phẩm
- Lọc theo loại (Sản phẩm mới/Bán chạy/Khuyến mãi)
- Header & Footer hiển thị trên mọi trang
- Trang giới thiệu công ty ConCaiNit Deluxe
- Animations fade-in và hover effects
- Responsive design cho mobile, tablet, desktop
- Sửa CORS để accept http://localhost:5173

---

## Bài 5 - Hiển Thị Sản Phẩm Theo Danh Mục & Sản Phẩm Bán Chạy

### Những file đã tạo:

- `frontend/src/pages/category/CategoryPage.tsx` - Trang danh sách sản phẩm theo danh mục
- `frontend/src/components/BestsellersCarousel.tsx` - Component hiển thị 10 sản phẩm bán chạy nhất
- `frontend/src/components/MostViewedCarousel.tsx` - Component hiển thị 10 sản phẩm xem nhiều nhất

### Những file đã cập nhật:

- `backend/src/repositories/product.repository.js` - Thêm methods `findProductsByCategory`, `findBestsellers`, `findMostViewed`
- `backend/src/controllers/product.controller.js` - Thêm endpoints `getProductsByCategory`, `getBestsellers`, `getMostViewed`
- `backend/src/routes/product.routes.js` - Thêm routes `/categories/:categoryId/products`, `/products/bestsellers`, `/products/most-viewed`
- `backend/prisma/schema.prisma` - Thêm field `viewCount` cho Product
- `frontend/src/api/productAPI.ts` - Thêm functions `fetchProductsByCategory`, `fetchTopBestsellers`, `fetchTopMostViewed`
- `frontend/src/pages/home/HomePage.tsx` - Thêm hai carousel sections

### Những gì đã làm:

- Lấy danh sách sản phẩm theo danh mục từ database
- Phân trang sản phẩm (12 sản phẩm/trang)
- Lazy loading hoặc phân trang truyền thống khi kéo xuống cuối trang
- Hiển thị danh mục sản phẩm
- Lấy 10 sản phẩm bán chạy nhất (sorted by sold count)
- Lấy 10 sản phẩm xem nhiều nhất (sorted by viewCount)
- Hiển thị theo kiểu carousel chiều ngang (Swiper)
- Phân trang theo chiều ngang (navigation buttons)
- Responsive design
- Loading state
- Animation khi load

---
