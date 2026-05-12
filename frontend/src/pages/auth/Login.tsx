import React, { useState } from 'react';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { useAppDispatch } from '../../hooks';
import { login } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Star, Zap } from 'lucide-react';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await dispatch(login({ email, password })).unwrap();
      if (res?.user) {
        navigate('/profile');
      }
    } catch (err: any) {
      let errorMsg = 'Login failed. Please try again.';
      if (err?.message) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* App Logo & Title */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {/* Logo Background Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-full blur-2xl opacity-40 animate-pulse" />
          
          {/* Logo Container */}
          <div className="relative">
            {/* Brand Circle */}
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg mb-2 mx-auto">
              <Zap className="w-7 h-7 text-white" />
            </div>
            
            {/* App Name with Background */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                PubliCast
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Pro Streaming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Icon with Glow */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {/* Outer Glow Ring */}
          <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
          
          {/* Icon Container */}
          <div className="relative w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white animate-pulse" />
          </div>
          
          {/* Inner Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-cyan-400/20 blur-lg" />
        </div>
      </div>

      {/* Welcome Text with Gradient Glow */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
          Welcome Back
        </h2>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        {/* Email Input */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="w-3 h-3 rounded border-slate-700 bg-slate-800 cursor-pointer accent-purple-600 disabled:opacity-50"
            />
            <span className="text-slate-400">Remember me</span>
          </label>
          <Link to="/forgot" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Forgot?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative mb-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-slate-900/40 text-slate-500">OR</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button className="p-2 rounded-lg border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all flex items-center justify-center text-lg">
          🎮
        </button>
        <button className="p-2 rounded-lg border border-slate-700 hover:border-red-500/50 hover:bg-slate-800/50 transition-all flex items-center justify-center text-lg">
          📺
        </button>
        <button className="p-2 rounded-lg border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all flex items-center justify-center text-lg font-bold">
          f
        </button>
      </div>

      {/* Register Link */}
      <p className="text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
