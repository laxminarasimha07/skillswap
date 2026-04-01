import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, MessageCircle, Users, Calendar, User, LogOut, Menu, X, Search, Zap
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get('q') || '');
  }, [location.search]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = searchValue.trim();
      const currentQ = new URLSearchParams(location.search).get('q') || '';
      if (trimmed) {
        if (trimmed !== currentQ) navigate(`/feed?q=${encodeURIComponent(trimmed)}`);
      } else {
        if (currentQ) navigate('/feed');
      }
    }, 250);
    return () => clearTimeout(t);
  }, [searchValue, navigate, location.search]);

  const navigation = [
    { name: 'Feed', href: '/feed', icon: Home },
    { name: 'Connections', href: '/connections', icon: Users },
    { name: 'Messages', href: '/chat', icon: MessageCircle },
    { name: 'Sessions', href: '/sessions', icon: Calendar },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 border-b border-[#1F2937] bg-[#0B0F19]/90 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-[Poppins]">
              SkillSwap
            </span>
          </Link>

          {/* Search */}
          <div className="hidden sm:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4B5563]" />
              <input
                type="text"
                placeholder="Search skills, students..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111827] border border-[#1F2937] text-[#E5E7EB] placeholder-[#4B5563] text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-purple-600/20 to-cyan-500/10 border border-purple-500/30'
                      : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#111827]'
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? 'text-purple-400' : ''}`} />
                  {item.name}
                </Link>
              );
            })}

            <div className="h-5 w-px bg-[#1F2937] mx-2" />

            <button
              onClick={handleLogout}
              className="p-2 text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#111827] transition-all"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-t border-[#1F2937] bg-[#0B0F19] px-4 py-3 space-y-1 overflow-hidden"
          >
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/15 text-white border border-purple-500/30'
                      : 'text-[#9CA3AF] hover:bg-[#111827] hover:text-[#E5E7EB]'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-purple-400' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
