import { LayoutDashboard, User, Key, Settings, LogOut, Camera, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('profile');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'stream-keys', label: 'Stream Keys', icon: Key },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full flex bg-slate-950 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Sidebar */}
      <aside className="w-72 h-screen sticky top-0 border-r border-slate-800/50 backdrop-blur-xl bg-slate-900/30 p-6 flex flex-col">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 blur-lg bg-purple-500/30 rounded-xl" />
            </div>
            <div>
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                StreamHub
              </h1>
              <p className="text-xs text-slate-500">Pro Dashboard</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/30">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/40 border-b border-slate-800/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-slate-200 mb-1">Dashboard</h2>
              <p className="text-sm text-slate-500">Welcome back to your streaming center</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-full backdrop-blur-xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Pro Streamer
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-xl bg-slate-900/40 border border-purple-500/20 rounded-3xl p-12 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Welcome to Your Dashboard
              </h1>
              <p className="text-slate-300">Select an option from the sidebar to get started.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
