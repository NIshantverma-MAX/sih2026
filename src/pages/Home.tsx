import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ShieldCheck, FlaskConical
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { recentQueries } from '../data/queries';
import { useTranslation } from '../hooks/useTranslation';
import { searchService } from '../services/searchService';
import bisHomeHeroImg from '../assets/bis-home-hero.png';

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
    <div className="mx-auto w-full max-w-[1360px] space-y-4 pb-10 sm:pb-12">
      {/* Hero Section */}
      <section className="relative min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl lg:min-h-[558.031px]">
        
        {/* Background Geometric Pattern */}
        <div className="absolute inset-0 z-0 bg-[#f4f7fc]" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='800' viewBox='0 0 1200 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L600,0 L0,800 Z' fill='%23eef2fb'/%3E%3Cpath d='M600,0 L1200,0 L1200,800 Z' fill='%23ffffff' opacity='0.7'/%3E%3Cpath d='M0,800 L1200,800 L600,0 Z' fill='%23e4ebfa' opacity='0.6'/%3E%3Cpath d='M400,0 L1000,800 L100,800 Z' fill='%23ffffff' opacity='0.5'/%3E%3Cpath d='M800,0 L1200,400 L200,0 Z' fill='%23dbe6f5' opacity='0.4'/%3E%3C/svg%3E")`,
               backgroundSize: 'cover',
               backgroundPosition: 'left center'
             }}>
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col lg:min-h-[558.031px] lg:flex-row">
          
          <div className="relative flex w-full flex-col justify-center p-5 sm:p-8 lg:w-[65%] lg:p-12">
            {/* The white diagonal cut covering the image edge */}
            <div className="hidden lg:block absolute top-0 -right-16 bottom-0 w-32 bg-transparent z-20 pointer-events-none"
                 style={{ 
                   background: 'linear-gradient(100deg, rgba(244,247,252,1) 40%, rgba(255,255,255,0) 60%)' 
                 }}>
            </div>

            <div className="relative z-30 mb-6 max-w-[600px] sm:mb-8">
              <h1 className="mb-3 text-[22px] font-extrabold leading-[1.15] tracking-tight text-[#0c1a3b] sm:text-[30px] lg:text-[34px]">
                <span className="block">BUREAU OF INDIAN</span>
                <span className="block">STANDARDS:</span>
                <span className="block text-[#1e293b]">National Standards</span>
                <span className="block text-[#1e293b]">&amp; Compliance Portal</span>
              </h1>
              <p className="text-[14px] text-slate-600 font-medium mb-1">
                Official Access to QCOs, Product Manuals, IS Codes, and Laboratory Recognition.
              </p>
              <p className="max-w-[18rem] text-[12.5px] text-slate-400 sm:max-w-none">
                National Standards &amp; Compliance Portal | Powered by BIS SmartGuide AI.
              </p>
            </div>
            
            <div className="relative z-30 max-w-[680px] rounded-xl bg-white px-4 py-5 shadow-[0_4px_24px_rgb(0,0,0,0.06)] sm:rounded-2xl sm:px-7 sm:py-6">
              <h3 className="mb-4 text-[14px] font-bold leading-5 text-slate-900 sm:text-[14.5px]">Search Indian Standards and mandatory procedures.</h3>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex h-[50px] min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500">
                  <div className="pl-4 pr-2 flex items-center justify-center text-slate-400">
                    <Search size={18} className="search-icon" />
                  </div>
                  <input
                    className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-slate-900 outline-none placeholder-slate-400 sm:text-[14.5px]"
                    placeholder="e.g., IS 694, helmet, water purifier..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={!localQuery.trim()} className="h-[50px] w-full rounded-xl bg-[#7886a8] px-6 text-[14.5px] font-medium whitespace-nowrap text-white shadow-sm transition-colors hover:bg-[#637295] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
                  Official Search
                </Button>
              </form>
              
              <div className="mt-5">
                <p className="mb-2.5 text-[11.5px] font-bold leading-4 text-slate-800">Popular searches</p>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {popularSearches.map(item => (
                    <button
                      key={item.query}
                      type="button"
                      onClick={() => handlePopularSearch(item.query)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:px-3.5"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-64 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-80 lg:h-[558.031px] lg:w-[35%]">
             <div className="absolute inset-0 z-10 hidden bg-white lg:block" style={{ clipPath: 'polygon(0 0, 8% 0, 0 100%)' }}></div>
             <div className="absolute right-4 top-4 z-20 hidden flex-col items-center rounded-lg border border-slate-100 bg-white px-3 py-1.5 shadow-sm sm:right-6 sm:top-6 lg:flex">
               <img src="/bis-logo.png" alt="Govt of India" className="h-4 w-auto mb-1 opacity-90" />
               <span className="text-[9px] font-bold text-blue-900 tracking-tight">Govt of India (GOI)</span>
             </div>
            <img 
              src={bisHomeHeroImg}
              alt="Bureau of Indian Standards Building" 
              className="h-full w-full object-cover"
              style={{ objectPosition: '42% center' }}
            />
          </div>
        </div>
      </section>

      <div className="mb-6 mt-1 text-center sm:mb-8">
        <p className="text-[11.5px] text-slate-400 font-semibold tracking-wide">A Service by the Bureau of Indian Standards, Govt of India.</p>
      </div>

      {/* Lower Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
        
        {/* Explore Services */}
        <section>
          <h2 className="text-[20px] font-bold text-slate-900 mb-4">Explore Services</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:h-[calc(100%-48px)]">
            {services.map((service, idx) => (
              <Card 
                key={idx} 
                className="p-5 hover:shadow-md transition-shadow cursor-pointer border border-slate-200 hover:border-slate-300 flex flex-col group bg-white rounded-xl h-full"
                onClick={() => navigate(service.path)}
              >
                <div className="mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-slate-100 bg-white shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                    <service.icon className={`w-5 h-5 ${service.color}`} />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5 text-[15px]">{service.title}</h3>
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
          <Card className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:mt-[44px] lg:h-[calc(100%-12px)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 text-[16px]">Recent Queries</h3>
              <button onClick={() => navigate('/my-queries')} className="text-[13px] font-semibold text-indigo-600 hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentQueries.slice(0, 3).map((query, i) => (
                <div key={query.id} onClick={() => navigate('/my-queries')} className="group cursor-pointer">
                  <p className="text-[13.5px] font-medium text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug mb-1 line-clamp-2">
                    {query.question}
                  </p>
                  <p className="text-[11.5px] text-slate-400 font-medium">General • {query.date}</p>
                  {i !== 2 && <div className="h-px w-full bg-slate-100 mt-4"></div>}
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
