import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShieldCheck, FlaskConical, Shield
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { recentQueries } from '../data/queries';
import { useTranslation } from '../hooks/useTranslation';
import { searchService } from '../services/searchService';
import bisBuildingImg from '../assets/bis-building-crop.png';

export default function Home() {
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState('');
  const { t } = useTranslation();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (localQuery.trim()) {
      navigate(searchService.search(localQuery, 'hero'));
    }
  };

  const handlePopularSearch = (query: string) => {
    setLocalQuery(query);
    navigate(searchService.search(query, 'hero'));
  };

  const popularSearches = [
    { label: t('home.popular.waterPurifier') || 'Common Product Codes', query: 'water purifier' },
    { label: t('home.popular.ledBulb') || 'Cement Standards', query: 'cement' },
    { label: t('home.popular.goldJewellery') || 'Gold Hallmarking Rules', query: 'gold jewellery' },
    { label: t('home.popular.helmet') || 'Helmet QCO', query: 'helmet' },
    { label: t('home.popular.textile') || 'Textile Procedures', query: 'textile' }
  ];

  const services = [
    { title: t('home.services.findStandard.title') || 'Find Standard', icon: Search, color: 'text-blue-500', path: '/standards', desc: t('home.services.findStandard.desc') || 'Search and discover applicable Indian Standards.' },
    { title: t('home.services.certification.title') || 'Certification Guide', icon: ShieldCheck, color: 'text-green-500', path: '/certification', desc: t('home.services.certification.desc') || 'Step-by-step guide to get certified.' },
    { title: t('home.services.labs.title') || 'Testing Laboratories', icon: FlaskConical, color: 'text-purple-500', path: '/labs', desc: t('home.services.labs.desc') || 'Find recognized labs near you.' }
  ];

  return (
    <div className="space-y-4 max-w-[1360px] mx-auto pb-12">
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden min-h-[440px] relative border border-slate-200 dark:border-slate-700">
        
        {/* Background Geometric Pattern */}
        <div className="absolute inset-0 z-0 bg-[#f4f7fc] dark:bg-slate-800" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='800' viewBox='0 0 1200 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L600,0 L0,800 Z' fill='%23eef2fb'/%3E%3Cpath d='M600,0 L1200,0 L1200,800 Z' fill='%23ffffff' opacity='0.7'/%3E%3Cpath d='M0,800 L1200,800 L600,0 Z' fill='%23e4ebfa' opacity='0.6'/%3E%3Cpath d='M400,0 L1000,800 L100,800 Z' fill='%23ffffff' opacity='0.5'/%3E%3Cpath d='M800,0 L1200,400 L200,0 Z' fill='%23dbe6f5' opacity='0.4'/%3E%3C/svg%3E")`,
               backgroundSize: 'cover',
               backgroundPosition: 'left center'
             }}>
        </div>

        <div className="flex flex-col lg:flex-row h-full relative z-10 min-h-[440px]">
          
          <div className="w-full lg:w-[65%] p-8 lg:p-12 flex flex-col justify-center relative">
            {/* The white diagonal cut covering the image edge */}
            <div className="hidden lg:block absolute top-0 -right-16 bottom-0 w-32 bg-transparent z-20 pointer-events-none"
                 style={{ 
                   background: 'linear-gradient(100deg, rgba(244,247,252,1) 40%, rgba(255,255,255,0) 60%)' 
                 }}>
            </div>

            <div className="relative z-30 mb-8 max-w-[600px]">
              <h1 className="text-[30px] lg:text-[34px] font-extrabold text-[#0c1a3b] dark:text-white leading-[1.15] mb-3 tracking-tight">
                BUREAU OF INDIAN STANDARDS: <br/>
                <span className="text-[#1e293b] dark:text-slate-300">{t("home.nationalPortal") || "National Standards & Compliance Portal"}</span>
              </h1>
              <p className="text-[14px] text-slate-600 dark:text-slate-300 font-medium mb-1">
                Official Access to QCOs, Product Manuals, IS Codes, and Laboratory Recognition.
              </p>
              <p className="text-[12.5px] text-slate-400 dark:text-slate-500">
                {t("home.nationalPortal") || "National Standards & Compliance Portal"} | Powered by BIS SmartGuide AI.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 px-7 py-6 rounded-2xl shadow-[0_4px_24px_rgb(0,0,0,0.06)] relative z-30 max-w-[680px]">
              <h3 className="text-[14.5px] font-bold text-slate-900 dark:text-white mb-4">{t("home.searchAcross") || "Search across 20,000+ Indian Standards & Mandatory Procedures."}</h3>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden h-[50px]">
                  <div className="pl-4 pr-2 flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <Search size={18} className="search-icon" />
                  </div>
                  <input
                    className="flex-1 h-full outline-none text-slate-900 dark:text-white bg-transparent placeholder-slate-400 text-[14.5px]"
                    placeholder="e.g., IS Code (IS 694), Product Name (Heater), or Procedure Keyword..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={!localQuery.trim()} className="bg-[#7886a8] hover:bg-[#637295] disabled:opacity-70 disabled:cursor-not-allowed text-white whitespace-nowrap px-6 h-[50px] rounded-xl font-medium text-[14.5px] shadow-sm transition-colors">
                  Official Search
                </Button>
              </form>
              
              <div className="mt-5">
                <p className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 mb-2.5">{t("home.popularFeatured") || "Popular searches: Featured IS Codes & Common Procedures"}</p>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {popularSearches.map(item => (
                    <button
                      key={item.query}
                      type="button"
                      onClick={() => handlePopularSearch(item.query)}
                      className="text-[12px] px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500 dark:bg-slate-800 hover:text-indigo-700 hover:bg-indigo-50 transition-colors font-medium shadow-sm whitespace-nowrap"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative w-[35%] h-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
             <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 8% 0, 0 100%)', zIndex: 10 }}></div>
             <div className="absolute top-6 right-6 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 z-20 flex flex-col items-center">
               <img src="/bis-logo.png" alt="Govt of India" className="h-4 w-auto mb-1 opacity-90" />
               <span className="text-[9px] font-bold text-blue-900 tracking-tight">{t("home.goi") || "Govt of India (GOI)"}</span>
             </div>
            <img 
              src={bisBuildingImg} 
              alt="Bureau of Indian Standards Building" 
              className="w-full h-full object-cover"
              style={{ objectPosition: '30% center' }}
            />
          </div>
        </div>
      </section>

      <div className="text-center mt-1 mb-8">
        <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide">{t("home.serviceBy") || "A Service by the Bureau of Indian Standards, Govt of India."}</p>
      </div>

      {/* Lower Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
        
        {/* Explore Services */}
        <section>
          <h2 className="text-[20px] font-bold text-slate-900 dark:text-white mb-4">{t("home.exploreServices") || "Explore Services"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-[calc(100%-48px)]">
            {services.map((service, idx) => (
              <Card 
                key={idx} 
                className="p-5 hover:shadow-md transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-slate-300 flex flex-col group bg-white rounded-xl h-full"
                onClick={() => navigate(service.path)}
              >
                <div className="mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-slate-100 bg-white shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                    <service.icon className={`w-5 h-5 ${service.color}`} />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 text-[15px]">{service.title}</h3>
                <p className="text-[13px] text-slate-500 flex-1 leading-relaxed">{service.desc}</p>
                <div className="mt-5 text-[13px] font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                  Explore
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Queries */}
        <section>
          <Card className="p-6 bg-white shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl h-[calc(100%-12px)] mt-[44px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white text-[16px]">{t("home.recentQueries") || "Recent Queries"}</h3>
              <button onClick={() => navigate('/my-queries')} className="text-[13px] font-semibold text-indigo-600 hover:underline">{t("home.viewAll") || "View All"}</button>
            </div>
            <div className="space-y-4">
              {recentQueries.slice(0, 3).map((query, i) => (
                <div key={query.id} onClick={() => navigate('/my-queries')} className="group cursor-pointer">
                  <p className="text-[13.5px] font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors leading-snug mb-1 line-clamp-2">
                    {query.question}
                  </p>
                  <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium">{t("common.general") || "General"} • {query.date}</p>
                  {i !== 2 && <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mt-4"></div>}
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
