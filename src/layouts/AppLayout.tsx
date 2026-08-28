import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Home, 
  FileText, 
  FlaskConical, 
  Diamond, 
  HelpCircle, 
  MessageSquare, 
  Upload, 
  Bookmark, 
  Settings,
  Search,
  Menu
} from 'lucide-react';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { UserMenu } from '../components/common/UserMenu';
import { NotificationMenu } from '../components/common/NotificationMenu';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../hooks/useTranslation';
import { searchService } from '../services/searchService';

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(searchService.search(searchInput, 'global'));
    }
  };

  const navLinks = [
    { to: '/', icon: Home, label: t('nav.home') },
    { to: '/standards', icon: FileText, label: t('nav.standards') },
    { to: '/certification', icon: Shield, label: t('nav.certificationGuide') },
    { to: '/labs', icon: FlaskConical, label: t('nav.labs') },
    { to: '/hallmarking', icon: Diamond, label: t('nav.hallmarking') },
    { to: '/consumer-help', icon: HelpCircle, label: t('nav.consumerHelp') },
  ];

  const userLinks = [
    { to: '/my-queries', icon: MessageSquare, label: t('nav.myQueries') },
    { to: '/upload-document', icon: Upload, label: t('nav.uploadDocument') },
    { to: '/saved-items', icon: Bookmark, label: t('nav.savedItems') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="p-2 bg-blue-900 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">BIS SmartGuide</h1>
          <p className="text-xs text-gray-500 font-medium">AI Standards & Certification</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-900' : 'text-gray-400'}`} />
                  {link.label}
                  {isActive && <div className="absolute left-0 w-1 h-8 bg-blue-900 rounded-r-full" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t('nav.yourAccount')}
          </div>
          <nav className="space-y-1">
            {userLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-900' : 'text-gray-400'}`} />
                    {link.label}
                    {isActive && <div className="absolute left-0 w-1 h-8 bg-blue-900 rounded-r-full" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-900 font-medium mb-1">
            <HelpCircle className="w-5 h-5" />
            {t('nav.needHelp')}
          </div>
          <p className="text-sm text-blue-800/80 mb-3">
            {t('nav.contactSupportDesc')}
          </p>
          <button className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            {t('nav.contactSupport')}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <form onSubmit={handleSearch} className="max-w-2xl w-full hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 bg-gray-50/50 text-sm"
                />
                <button 
                  type="submit"
                  disabled={!searchInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-900 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {t('header.searchButton')}
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            <LanguageSelector />
            <NotificationMenu />
            <UserMenu />
          </div>
        </header>

        {/* Mobile Search - Visible only on small screens */}
        <div className="p-4 bg-white border-b border-gray-200 sm:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 bg-gray-50/50 text-sm"
              />
            </div>
          </form>
        </div>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
