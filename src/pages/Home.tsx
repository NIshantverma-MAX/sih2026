import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShieldCheck, FlaskConical, ChevronRight, FileText, ArrowRight, Shield
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
    { label: t('home.popular.ledBulb') || 'LED Bulb', query: 'led bulb' },
    { label: t('home.popular.steelBottle') || 'Stainless Steel Bottle', query: 'steel bottle' },
    { label: t('home.popular.goldJewellery') || 'Gold Jewellery', query: 'gold jewellery' },
    { label: t('home.popular.pressureCooker') || 'Pressure Cooker', query: 'pressure cooker' },
  ];

  const services = [
    { title: t('home.services.findStandard.title') || 'Find Standard', icon: Search, bg: 'bg-blue-50', color: 'text-blue-600', path: '/standards', desc: t('home.services.findStandard.desc') || 'Search and discover applicable Indian Standards.' },
    { title: t('home.services.certification.title') || 'Certification Guide', icon: ShieldCheck, bg: 'bg-green-50', color: 'text-green-600', path: '/certification', desc: t('home.services.certification.desc') || 'Step-by-step guide to get certified.' },
    { title: t('home.services.labs.title') || 'Testing Laboratories', icon: FlaskConical, bg: 'bg-purple-50', color: 'text-purple-600', path: '/labs', desc: t('home.services.labs.desc') || 'Find recognized labs near you.' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[380px] relative">
        {/* Subtle geometric background pattern for left side */}
        <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-white via-white/95 to-transparent z-0"></div>
        <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-[#eaf1ff] to-transparent z-0 opacity-50"></div>

        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] h-full relative z-10">
          <div className="p-8 lg:p-12 space-y-6 flex flex-col justify-center">
            <div>
              <h1 className="text-3xl lg:text-[2.5rem] font-extrabold text-[#0c1a3b] leading-tight mb-3 tracking-tight">
                {t('home.welcome')} <br/>
                <span className="text-slate-800">{t('home.welcomeBrand')}</span>
              </h1>
              <p className="text-[15px] text-slate-600 font-medium">
                {t('home.subtitle')}
              </p>
              <p className="text-[13px] text-slate-400 mt-1">
                National Standards & Compliance Portal | Powered by BIS SmartGuide AI.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-sm mt-4">
              <h3 className="text-[15px] font-bold text-slate-900 mb-3">{t('home.searchTitle')}</h3>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 flex items-center bg-white border border-slate-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden h-[52px]">
                  <div className="pl-4 pr-2 flex items-center justify-center text-slate-400">
                    <Search size={20} className="search-icon" />
                  </div>
                  <input
                    className="flex-1 h-full outline-none text-slate-900 bg-transparent placeholder-slate-400 text-[15px]"
                    placeholder={t('home.searchPlaceholder')}
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={!localQuery.trim()} className="bg-[#6b7280] hover:bg-[#4b5563] disabled:opacity-70 disabled:cursor-not-allowed text-white whitespace-nowrap px-8 h-[52px] rounded-lg font-medium text-[15px]">
                  {t('home.findStandards') || 'Official Search'}
                </Button>
              </form>
              
              <div className="mt-5">
                <p className="text-[13px] font-bold text-slate-800 mb-2">{t('home.popularSearches')}: Featured IS Codes & Common Procedures</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {popularSearches.map(item => (
                    <button
                      key={item.query}
                      type="button"
                      onClick={() => handlePopularSearch(item.query)}
                      className="text-[13px] px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors font-medium shadow-sm"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative h-full bg-slate-100 overflow-hidden">
             {/* The diagonal slash overlay effect from reference */}
             <div className="absolute inset-y-0 left-0 w-32 bg-white z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 0% 100%, 0% 100%)' }}></div>
             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm border border-slate-200 z-20 flex flex-col items-center">
               <Shield className="w-5 h-5 text-blue-900 mb-0.5" />
               <span className="text-[9px] font-bold text-slate-700">Govt of India (GOI)</span>
             </div>
            <img 
              src={bisBuildingImg} 
              alt="Bureau of Indian Standards Building" 
              className="w-full h-full object-cover object-[right_center] absolute inset-0"
            />
          </div>
        </div>
      </section>

      <div className="text-center">
        <p className="text-[13px] text-slate-400 font-medium">A Service by the Bureau of Indian Standards, Govt of India.</p>
      </div>

      {/* Lower Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
        
        {/* Explore Services */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-5">{t('home.exploreServices') || 'Explore Services'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {services.map((service, idx) => (
              <Card 
                key={idx} 
                className="p-5 hover:shadow-md transition-shadow cursor-pointer border border-slate-200 hover:border-slate-300 flex flex-col group bg-white h-full"
                onClick={() => navigate(service.path)}
              >
                <div className="mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-slate-100 bg-slate-50 shadow-sm group-hover:scale-105 transition-transform`}>
                    <service.icon className={`w-5 h-5 ${service.color}`} />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-[15px]">{service.title}</h3>
                <p className="text-[13.5px] text-slate-500 flex-1 leading-relaxed">{service.desc}</p>
                <div className="mt-5 text-[13px] font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                  {t('home.exploreBtn') || 'Explore'}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Queries */}
        <section>
          <Card className="p-6 bg-white shadow-sm border border-slate-200 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 text-lg">{t('home.recentQueries') || 'Recent Queries'}</h3>
              <button onClick={() => navigate('/my-queries')} className="text-[13px] font-semibold text-blue-600 hover:underline">{t('home.viewAll') || 'View All'}</button>
            </div>
            <div className="space-y-5">
              {recentQueries.slice(0, 3).map(query => (
                <div key={query.id} onClick={() => navigate('/my-queries')} className="group cursor-pointer">
                  <p className="text-[14px] font-medium text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mb-1 line-clamp-2">
                    {query.question}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">{t('common.general') || 'General'} • {query.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
