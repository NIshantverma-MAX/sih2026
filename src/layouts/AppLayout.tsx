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
            {t('nav.yourAccount') || 'YOUR ACCOUNT'}
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
              {t('nav.askSmartGuide') || 'Ask SmartGuide'}
            </button>
          </nav>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-transparent border border-[#1e293b] rounded-lg p-4">
          <div className="flex items-center gap-2 text-white font-medium mb-1">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] font-semibold">{t('nav.needHelp') || 'Need Help?'}</span>
          </div>
          <p className="text-[11.5px] text-slate-400 mb-3 leading-relaxed">
            {t('nav.contactSupportDesc') || 'Contact our support team for technical assistance.'}
          </p>
          <button className="w-full bg-transparent text-slate-300 border border-[#334155] py-1.5 rounded-md text-[12.5px] font-medium hover:bg-[#1e293b] transition-colors">
            {t('nav.contactSupport') || 'Contact Support'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 flex flex-col">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-[64px] flex items-center justify-between px-4 md:px-6 z-30 shrink-0 shadow-sm relative">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center justify-center pt-0.5">
              <img src="/bis-logo.png" alt="BIS Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[17px] font-extrabold text-[#0c1a3b] dark:text-white leading-tight tracking-tight">{t('header.bis') || 'Bureau of Indian Standards'}</h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('header.bisSub') || 'The National Standards Body of India'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-center max-w-2xl px-4">
          {!isHome && (
            <form onSubmit={handleSearch} className="w-full hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 bg-gray-50/50 dark:bg-slate-800 text-sm"
                />
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <UserMenu />
          <NotificationMenu />
          <LanguageSelector />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`
          absolute inset-y-0 left-0 z-20 w-[240px] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto">
          {!isHome && (
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 md:hidden shrink-0">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder={t('header.searchPlaceholder')}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 bg-gray-50/50 dark:bg-slate-800 text-sm"
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
