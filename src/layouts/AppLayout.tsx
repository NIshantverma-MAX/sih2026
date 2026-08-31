import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
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
  ShieldCheck
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
    { to: '/', icon: Home, label: t('nav.home') || 'Home' },
    { to: '/standards', icon: FileText, label: t('nav.standards') || 'Standards' },
    { to: '/certification', icon: ShieldCheck, label: t('nav.certificationGuide') || 'Certification Guide' },
    { to: '/labs', icon: FlaskConical, label: t('nav.labs') || 'Testing Laboratories' },
    { to: '/hallmarking', icon: Diamond, label: t('nav.hallmarking') || 'Hallmarking' },
    { to: '/consumer-help', icon: HelpCircle, label: t('nav.consumerHelp') || 'Consumer Help' },
  ];

  const userLinks = [
    { to: '/upload-document', icon: Upload, label: t('nav.uploadDocument') || 'Upload Document' },
    { to: '/saved-items', icon: Bookmark, label: t('nav.savedItems') || 'Saved Items' },
    { to: '/settings', icon: Settings, label: t('nav.settings') || 'Settings' },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#0b132b] text-white">
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? "bg-[#1f2937] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="pt-2">
          <div className="px-4 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            YOUR ACCOUNT
          </div>
          <nav className="space-y-1">
            {userLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? "bg-[#1f2937] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {link.label}
                  </>
                )}
              </NavLink>
            ))}
            
            <button 
              onClick={() => { navigate('/ask'); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[14px] font-medium text-slate-300 hover:text-white transition-colors bg-[#1e293b] mt-3 border border-[#334155] hover:bg-[#334155]"
            >
              <MessageSquare className="w-[18px] h-[18px] text-slate-400" />
              Ask SmartGuide
            </button>
          </nav>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-transparent border border-[#1e293b] rounded-lg p-4">
          <div className="flex items-center gap-2 text-white font-medium mb-1">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] font-semibold">Need Help?</span>
          </div>
          <p className="text-[11.5px] text-slate-400 mb-3 leading-relaxed">
            Contact our support team for technical assistance.
          </p>
          <button className="w-full bg-transparent text-slate-300 border border-[#334155] py-1.5 rounded-md text-[12.5px] font-medium hover:bg-[#1e293b] transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen min-h-dvh flex-col bg-[#f8fafc]">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header className="relative z-30 flex min-h-16 shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2 shadow-sm md:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Open navigation menu"
            className="min-h-10 min-w-10 rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            className="flex min-w-0 items-center gap-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 sm:gap-3"
            onClick={() => navigate('/')}
          >
            <div className="flex shrink-0 items-center justify-center pt-0.5">
              <img src="/bis-logo.png" alt="BIS Logo" className="h-8 w-auto object-contain sm:h-10" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[17px] font-extrabold text-[#0c1a3b] leading-tight tracking-tight">Bureau of Indian Standards</h1>
              <p className="text-[11px] text-slate-500 font-medium">The National Standards Body of India</p>
            </div>
          </button>
        </div>

        <div className="hidden max-w-2xl flex-1 items-center justify-center px-4 md:flex">
          {!isHome && (
            <form onSubmit={handleSearch} className="w-full">
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

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-4">
          <UserMenu />
          <NotificationMenu />
          <LanguageSelector />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-[240px] transform transition-transform duration-300 ease-in-out md:relative md:z-20 md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">
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
          <div className="p-4 md:p-8 lg:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
