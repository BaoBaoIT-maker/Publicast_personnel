import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Search, Filter, Home, Info } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onSearch?: (term: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex flex-col">
      {/* ===== HEADER ===== */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl sticky top-0 z-50 border-b-2 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Top Row: Logo & User Info */}
          <div className="flex items-center justify-between mb-4">
            {/* Logo - ConCaiNit Deluxe */}
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Luxury Belt Icon */}
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-amber-500/50 transition-all duration-300 transform group-hover:scale-110">
                <span className="text-white font-bold text-2xl">⌛</span>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  ConCaiNit
                </h1>
                <p className="text-xs font-semibold text-amber-300/80 tracking-widest uppercase">
                  Deluxe
                </p>
              </div>
            </div>

            {/* Desktop: Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-200 hover:text-white hover:bg-slate-700/50 hover:border-amber-500/50 transition-all font-semibold text-sm border border-transparent"
              >
                <Home size={18} />
                Trang Chủ
              </button>
              <button
                onClick={() => navigate('/about')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-200 hover:text-white hover:bg-slate-700/50 hover:border-amber-500/50 transition-all font-semibold text-sm border border-transparent"
              >
                <Info size={18} />
                Giới Thiệu
              </button>
            </nav>

            {/* Desktop: User Info */}
            <div className="hidden md:flex items-center gap-4">
              {userInfo.id ? (
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-700/30 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all group">
                  {userInfo.avatarUrl && (
                    <img
                      src={userInfo.avatarUrl}
                      alt="Avatar"
                      className="h-9 w-9 rounded-full object-cover border border-amber-400/50 group-hover:border-amber-300 transition-colors"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-amber-100 text-sm">
                      {userInfo.fullName || 'Khách'}
                    </p>
                    <p className="text-xs text-amber-300/60">{userInfo.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition-all text-sm font-semibold shadow-lg hover:shadow-red-600/50 transform hover:scale-105"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth/login')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-amber-500/50 transform hover:scale-105"
                >
                  Đăng nhập
                </button>
              )}
            </div>

            {/* Mobile: Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-amber-300 hover:text-amber-200 transition-colors"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden bg-slate-800/90 backdrop-blur px-4 py-4 border-t border-amber-500/20 rounded-lg space-y-3">
              <button
                onClick={() => {
                  navigate('/');
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-amber-200 hover:text-white hover:bg-slate-700/50 transition-all font-semibold text-sm"
              >
                <Home size={18} />
                Trang Chủ
              </button>
              <button
                onClick={() => {
                  navigate('/about');
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-amber-200 hover:text-white hover:bg-slate-700/50 transition-all font-semibold text-sm"
              >
                <Info size={18} />
                Giới Thiệu
              </button>
              {userInfo.id && (
                <>
                  <hr className="my-2 border-amber-500/20" />
                  <div className="flex items-center gap-2 mb-3 p-2">
                    {userInfo.avatarUrl && (
                      <img
                        src={userInfo.avatarUrl}
                        alt="Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-amber-100 text-sm">{userInfo.fullName}</p>
                      <p className="text-xs text-amber-300/60">{userInfo.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1">{children}</main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 border-t-2 border-amber-500 py-12 px-4 text-center mt-12">
        <div className="max-w-7xl mx-auto">
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-black bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-2">
                ConCaiNit Deluxe
              </h3>
              <p className="text-amber-300/70 text-sm">
                Dây nịt cao cấp cho phái mạnh và phái yếu
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-amber-300 mb-3">Liên Kết</h4>
              <ul className="space-y-2 text-sm text-amber-100/70 hover:text-amber-200 transition-colors">
                <li className="hover:text-amber-300 cursor-pointer">Về chúng tôi</li>
                <li className="hover:text-amber-300 cursor-pointer">Chính sách bảo mật</li>
                <li className="hover:text-amber-300 cursor-pointer">Điều khoản dịch vụ</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-amber-300 mb-3">Liên Hệ</h4>
              <p className="text-amber-100/70 text-sm">
                📧 support@concatnit.com
              </p>
              <p className="text-amber-100/70 text-sm">
                📱 1900 0000 (Hotline)
              </p>
              <p className="text-amber-100/70 text-sm">
                🏪 Showroom: TP. Hồ Chí Minh
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-amber-500/20 pt-6">
            <p className="text-amber-100 font-semibold mb-1">
              © 2026 ConCaiNit Deluxe - Bán Dây Nịt Sang Trọng
            </p>
            <p className="text-amber-300/50 text-xs">
              Thiết kế với ❤️ | Chất lượng là thứ chúng tôi cam kết
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
