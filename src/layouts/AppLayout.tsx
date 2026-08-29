import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Menu,
  MessageCircle
} from 'lucide-react';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { UserMenu } from '../components/common/UserMenu';
import { NotificationMenu } from '../components/common/NotificationMenu';
import { useTranslation } from '../hooks/useTranslation';
import { searchService } from '../services/searchService';

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const isHome = location.pathname === '/';

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
    { to: '/upload-document', icon: Upload, label: t('nav.uploadDocument') },
    { to: '/saved-items', icon: Bookmark, label: t('nav.savedItems') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#0c1322] text-white border-r border-[#1a233a]">
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {link.label}
                  {isActive && <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div>
          <div className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            YOUR ACCOUNT
          </div>
          <nav className="space-y-1">
            {userLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {link.label}
                    {isActive && <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-[#1a233a]">
        <button 
          onClick={() => { navigate('/ask'); setIsMobileMenuOpen(false); }}
          className="w-full bg-[#1e293b] text-white border border-[#334155] py-3 rounded-lg text-sm font-medium hover:bg-[#334155] transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5 text-blue-400" />
          Ask SmartGuide
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-1.5 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-800" fill="currentColor" stroke="white" strokeWidth={1} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[17px] font-bold text-slate-900 leading-tight">Bureau of Indian Standards</h1>
              <p className="text-[11px] text-slate-500 font-medium">The National Standards Body of India</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-center max-w-2xl px-4">
          {!isHome && (
            <form onSubmit={handleSearch} className="w-full hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 bg-gray-50/50 text-sm"
                />
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <UserMenu />
          <NotificationMenu />
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          absolute inset-y-0 left-0 z-20 w-[260px] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar />
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Search - Visible only on small screens */}
          {!isHome && (
            <div className="p-4 bg-white border-b border-gray-200 md:hidden shrink-0">
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
          )}
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
