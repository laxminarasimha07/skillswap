import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageCircle, Users, Calendar, User, LogOut, Menu, X, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  React.useEffect(() => {
    const p = new URLSearchParams(location.search);
    setSearchValue(p.get('q') || '');
  }, [location.search]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      const q = searchValue.trim();
      const cur = new URLSearchParams(location.search).get('q') || '';
      if (q) { if (q !== cur) navigate(`/feed?q=${encodeURIComponent(q)}`); }
      else { if (cur) navigate('/feed'); }
    }, 300);
    return () => clearTimeout(t);
  }, [searchValue, navigate, location.search]);

  const navItems = [
    { name: 'Feed',        href: '/feed',        icon: Home },
    { name: 'Connections', href: '/connections', icon: Users },
    { name: 'Messages',    href: '/chat',        icon: MessageCircle },
    { name: 'Sessions',    href: '/sessions',    icon: Calendar },
    { name: 'Profile',     href: '/profile',     icon: User },
  ];

  if (!isAuthenticated) return null;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2.5 shrink-0 mr-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="M3 8l4-5 3 3.5L12 3l1 5-5 5-5-5z" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">SkillSwap</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search skills, users..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm bg-slate-900 border border-slate-800 rounded-full text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-auto mr-4">
            {navItems.map(item => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {initials}
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="hidden md:flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800 bg-slate-950 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search skills, users..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                {navItems.map(item => {
                  const active = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <hr className="border-slate-800" />
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
