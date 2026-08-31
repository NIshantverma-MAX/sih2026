import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn, Settings, MessageSquare, ChevronDown, Loader2 } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { getInitials } from '../../utils/helpers';
import { loginWithGoogle, logout as authLogout } from '../../services/authService';
import toast from 'react-hot-toast';

export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAppStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setIsSigningIn(false);
      toast.error(error instanceof Error ? error.message : 'Google sign-in failed.');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        aria-label="Sign in"
        onClick={handleGoogleSignIn}
        disabled={isSigningIn}
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-medium text-blue-900 hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-0 sm:px-3"
      >
        {isSigningIn ? (
          <Loader2 className="h-4 w-4 animate-spin sm:mr-1.5" />
        ) : (
          <LogIn className="h-4 w-4 sm:mr-1.5" />
        )}
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  const handleAction = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await authLogout();
    logout();
    navigate('/');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        aria-label="Open account menu"
        className="flex min-h-10 items-center gap-1 rounded-full px-1.5 py-1.5 transition-colors hover:bg-gray-100 sm:gap-2 sm:px-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-white">
          {getInitials(user.name)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-700">{user.name}</p>
        </div>
        <ChevronDown className="hidden h-4 w-4 text-gray-500 sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 max-w-[calc(100vw-1rem)] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-blue-900 mt-1 capitalize">{user.role}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => handleAction('/profile')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User className="w-4 h-4 mr-3 text-gray-400" />
              Profile
            </button>
            <button
              onClick={() => handleAction('/queries')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <MessageSquare className="w-4 h-4 mr-3 text-gray-400" />
              My Queries
            </button>
            <button
              onClick={() => handleAction('/settings')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-4 h-4 mr-3 text-gray-400" />
              Settings
            </button>
          </div>
          <div className="py-1 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3 text-red-500" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
