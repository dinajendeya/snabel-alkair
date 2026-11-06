import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  HeartHandshake,
  Bell,
  User,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#contact-us');
      setTimeout(() => {
        const el = document.getElementById('contact-us');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('contact-us');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Senabil
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Gaza Relief
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/projects"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/projects')
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Projects
            </Link>
            <a
              href="#contact-us"
              onClick={scrollToContact}
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Contact Us
            </a>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notification Bell (Only for Authenticated Users) */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen((prev) => !prev)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors focus:outline-none"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                />
              </div>
            )}

            {/* Admin Dashboard shortcut */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Profile / Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">
                      {user?.firstName}
                    </p>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {user?.role.toLowerCase()}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => logout()}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-sm shadow-emerald-600/20"
              >
                <User className="w-4 h-4" />
                <span>Join / Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 rounded-full h-3.5 w-3.5 bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/projects"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Projects
          </Link>
          <a
            href="#contact-us"
            onClick={scrollToContact}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Contact Us
          </a>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-800 bg-emerald-50"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>My Profile ({user?.firstName})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-600 font-medium hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Join / Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

