# Publicast Personnel - Login

---

## Bai 1 - Backend Login API

### Nhung file da tao:
- `backend/src/controllers/auth.controller.js` - Xu ly login request
- `backend/src/services/auth.service.js` - Logic xac thuc JWT, kiem tra password
- `backend/src/routes/auth.routes.js` - Endpoint POST /api/auth/login
- `backend/src/repositories/user.repository.js` - Truy van database lay user
- `backend/src/middlewares/auth.middleware.js` - Verify JWT token
- `backend/src/middlewares/login-rate-limit.middleware.js` - Rate limiting dang nhap

### Nhung gi da lam:
- Validation email/password
- Rate limiting (5 lan sai trong 15 phut)
- JWT Token (access + refresh token)
- Authorization middleware (kiem tra role user/admin)
- Hashing password bcryptjs
- 2 duong dan profile: `/user/profile` (user) va `/admin/profile` (admin)

---

## Bai 2 - UI Login

### Nhung file da tao:
- `frontend/src/pages/auth/Login.tsx` - Trang dang nhap
- `frontend/src/components/ui/FormInput.tsx` - Component input
- `frontend/src/features/auth/authAPI.ts` - Goi API login
- `frontend/src/features/auth/authSlice.ts` - Redux state management

### Nhung gi da lam:
- Giao dien form dang nhap
- TailwindCSS styling
- Axios goi API backend
- Redux Hook quan ly state (loading, error, user data)
- Luu token vao localStorage
- Redirect sau khi login thanh cong

---
