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
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 px-2">
      {/* Hero Section */}
      <section className="bg-white rounded-[24px] shadow-sm overflow-hidden h-[460px] relative border border-slate-200">
        
        {/* Background Geometric Pattern */}
        <div className="absolute inset-0 z-0 bg-[#eef4ff] opacity-80" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h800v600H0z' fill='%23eef4ff'/%3E%3Cpath d='M-100 -100L400 300L-100 700Z' fill='%23e2ecff'/%3E%3Cpath d='M800 -100L200 300L800 800Z' fill='%23dbe6fc' opacity='0.5'/%3E%3Cpath d='M200 -200L600 200L100 500Z' fill='%23ffffff' opacity='0.7'/%3E%3Cpath d='M400 600L800 200L900 700Z' fill='%23ffffff' opacity='0.8'/%3E%3C/svg%3E")`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[62%_38%] h-full relative z-10">
          
          <div className="p-8 lg:p-14 flex flex-col justify-center relative">
            {/* The white diagonal cut covering the image edge */}
            <div className="hidden lg:block absolute top-0 -right-24 bottom-0 w-48 bg-transparent z-20 pointer-events-none"
                 style={{ 
                   background: 'linear-gradient(105deg, rgba(238,244,255,1) 40%, rgba(255,255,255,0) 60%)' 
                 }}>
            </div>

            <div className="relative z-30 max-w-2xl">
              <h1 className="text-[28px] lg:text-[34px] font-extrabold text-[#111827] leading-[1.1] mb-4 tracking-tight">
                BUREAU OF INDIAN STANDARDS: <br/>
                <span className="text-[#1f2937]">National Standards &amp; Compliance Portal</span>
              </h1>
              <p className="text-[14px] text-slate-600 font-medium mb-1">
                Official Access to QCOs, Product Manuals, IS Codes, and Laboratory Recognition.
              </p>
              <p className="text-[13px] text-slate-400 mb-8">
                National Standards &amp; Compliance Portal | Powered by BIS SmartGuide AI.
              </p>
            </div>
            
            <div className="bg-white p-7 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-30 max-w-[700px]">
              <h3 className="text-[15px] font-bold text-slate-900 mb-4">Search across 20,000+ Indian Standards &amp; Mandatory Procedures.</h3>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 flex items-center bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden h-[54px]">
                  <div className="pl-4 pr-3 flex items-center justify-center text-slate-400">
                    <Search size={20} className="search-icon" />
                  </div>
                  <input
                    className="flex-1 h-full outline-none text-slate-900 bg-transparent placeholder-slate-400 text-[15px]"
                    placeholder="e.g., IS Code (IS 694), Product Name (Heater), or Procedure Keyword..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={!localQuery.trim()} className="bg-[#7c8baf] hover:bg-[#64748b] disabled:opacity-70 disabled:cursor-not-allowed text-white whitespace-nowrap px-8 h-[54px] rounded-xl font-medium text-[15px] shadow-sm transition-colors">
                  Official Search
                </Button>
              </form>
              
              <div className="mt-6">
                <p className="text-[12px] font-bold text-slate-700 mb-3">Popular searches: Featured IS Codes &amp; Common Procedures</p>
                <div className="flex flex-wrap gap-3 items-center">
                  {popularSearches.map(item => (
                    <button
                      key={item.query}
                      type="button"
                      onClick={() => handlePopularSearch(item.query)}
                      className="text-[12.5px] px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-colors font-medium shadow-sm"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative h-full bg-slate-100 overflow-hidden">
             {/* Diagonal mask to match screenshot */}
             <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 15% 0, 0 100%)', zIndex: 10 }}></div>
             <div className="absolute top-6 right-6 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 z-20 flex flex-col items-center">
               <Shield className="w-6 h-6 text-blue-800 mb-1" />
               <span className="text-[10px] font-bold text-blue-900 tracking-tight">Govt of India (GOI)</span>
             </div>
            <img 
              src={bisBuildingImg} 
              alt="Bureau of Indian Standards Building" 
              className="w-full h-full object-cover"
              style={{ objectPosition: '20% center' }}
            />
          </div>
        </div>
      </section>

      <div className="text-center mt-2 mb-6">
        <p className="text-[12px] text-slate-400 font-semibold tracking-wide">A Service by the Bureau of Indian Standards, Govt of India.</p>
      </div>

      {/* Lower Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[68%_32%] gap-8">
        
        {/* Explore Services */}
        <section>
          <h2 className="text-[22px] font-bold text-slate-900 mb-6">Explore Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {services.map((service, idx) => (
              <Card 
                key={idx} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer border border-slate-200 hover:border-slate-300 flex flex-col group bg-white rounded-2xl h-full"
                onClick={() => navigate(service.path)}
              >
                <div className="mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100 bg-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-[16px]">{service.title}</h3>
                <p className="text-[14px] text-slate-500 flex-1 leading-relaxed">{service.desc}</p>
                <div className="mt-6 text-[14px] font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                  Explore
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Queries */}
        <section>
          <Card className="p-7 bg-white shadow-sm border border-slate-200 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 text-[18px]">Recent Queries</h3>
              <button onClick={() => navigate('/my-queries')} className="text-[14px] font-semibold text-indigo-600 hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {recentQueries.slice(0, 3).map((query, i) => (
                <div key={query.id} onClick={() => navigate('/my-queries')} className="group cursor-pointer">
                  <p className="text-[14.5px] font-medium text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug mb-1.5">
                    {query.question}
                  </p>
                  <p className="text-[12px] text-slate-400 font-medium">General • {query.date}</p>
                  {i !== 2 && <div className="h-px w-full bg-slate-100 mt-5"></div>}
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
