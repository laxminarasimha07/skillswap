import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Feed', href: '/feed' },
    { name: 'Network', href: '/connections' },
    { name: 'Messages', href: '/chat' },
    { name: 'Schedule', href: '/sessions' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#E5E5E5]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/feed" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#111111] rounded-full flex items-center justify-center">
            <div className="h-3 w-3 bg-white rounded-full" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#111111] font-['Manrope']">SkillSwap</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 bg-[#F9F9F9] p-1.5 rounded-full border border-[#E5E5E5]">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-[#111111] shadow-sm ring-1 ring-[#E5E5E5]' 
                    : 'text-[#666666] hover:text-[#111111] hover:bg-white/50'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/profile" className="text-sm font-semibold text-[#111111] hover:text-[#666666] transition-colors">
            Profile <ArrowUpRight className="inline-block h-3.5 w-3.5 mb-0.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-[#666666] hover:text-[#111111] transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 -mr-2 text-[#111111]"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-[#E5E5E5] bg-white overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-[#111111] font-['Manrope'] tracking-tight hover:text-[#666666]"
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-[#E5E5E5]" />
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-[#111111]">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-lg font-semibold text-[#111111] text-left">
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
