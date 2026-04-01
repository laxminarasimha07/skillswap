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

  const nav = [
    { name: 'Feed',        href: '/feed',        icon: Home },
    { name: 'Connections', href: '/connections',  icon: Users },
    { name: 'Messages',    href: '/chat',         icon: MessageCircle },
    { name: 'Sessions',    href: '/sessions',     icon: Calendar },
    { name: 'Profile',     href: '/profile',      icon: User },
  ];

  if (!isAuthenticated) return null;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-4">

          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2 shrink-0 mr-2">
            <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path d="M3 8l4-5 3 3.5L12 3l1 5-5 5-5-5z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-100 tracking-tight hidden sm:block">SkillSwap</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xs hidden sm:flex">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search…"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-0.5 ml-auto mr-2">
            {nav.map(item => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-indigo-400 bg-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Avatar + logout */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {initials}
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="hidden sm:flex items-center gap-1 h-7 px-2 text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/8 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="sm:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-0.5"
          >
            {/* Mobile search */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search…"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="w-full h-9 pl-8 pr-3 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {nav.map(item => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/8 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
