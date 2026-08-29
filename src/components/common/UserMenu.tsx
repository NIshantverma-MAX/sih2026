import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn, Settings, MessageSquare, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { getInitials } from '../../utils/helpers';
import { useTranslation } from '../../hooks/useTranslation';

export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAppStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <button 
        onClick={() => navigate('/login')}
        className="text-sm font-medium text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        <LogIn className="w-4 h-4 mr-1.5 inline-block" /> {t('header.signIn') || 'Sign In'}
      </button>
    );
  }

  const handleAction = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-medium">
          {getInitials(user.name)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-slate-200">{user.name}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
            <p className="text-xs text-blue-900 mt-1 capitalize">{user.role}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => handleAction('/profile')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <User className="w-4 h-4 mr-3 text-gray-400" />
              {t('header.profile') || 'Profile'}
            </button>
            <button
              onClick={() => handleAction('/queries')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <MessageSquare className="w-4 h-4 mr-3 text-gray-400" />
              {t('nav.myQueries') || 'My Queries'}
            </button>
            <button
              onClick={() => handleAction('/settings')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <Settings className="w-4 h-4 mr-3 text-gray-400" />
              {t('nav.settings') || 'Settings'}
            </button>
          </div>
          <div className="py-1 border-t border-gray-100 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3 text-red-500" />
              {t('header.signOut') || 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};