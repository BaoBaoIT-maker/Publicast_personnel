import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/auth/Profile';
import HomePage from './pages/home/HomePage';
import ProductDetailPage from './pages/product/ProductDetailPage';
import SearchPage from './pages/search/SearchPage';
import AboutPage from './pages/about/AboutPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderTrackingPage from './pages/order/OrderTrackingPage';
import OrderDetailPage from './pages/order/OrderDetailPage';
import OrderSuccessPage from './pages/order/OrderSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';

function RootRedirect() {
  const token = useSelector((state) => state.auth.token);
  return token ? <Navigate to="/" replace /> : <Navigate to="/auth/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        {/* Public Product Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/products" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Shopping Routes */}
        <Route
          path="/cart"
          element={<ProtectedRoute><CartPage /></ProtectedRoute>}
        />
        <Route
          path="/checkout"
          element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
        />
        <Route
          path="/order-success/:orderId"
          element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>}
        />
        <Route
          path="/order-tracking"
          element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>}
        />
        <Route
          path="/order/:orderId"
          element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>}
        />

        {/* Redirect old auth paths */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/forgot" element={<Navigate to="/auth/forgot" replace />} />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
