import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShieldCheck, FlaskConical, Diamond, Users, MessageCircle, 
  ChevronRight, FileText, Brain, CheckCircle, ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { recentQueries } from '../data/queries';
import { announcements } from '../data/announcements';
import { truncateText } from '../utils/helpers';
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
    { label: t('home.popular.waterPurifier'), query: 'water purifier' },
    { label: t('home.popular.ledBulb'), query: 'led bulb' },
    { label: t('home.popular.steelBottle'), query: 'steel bottle' },
    { label: t('home.popular.goldJewellery'), query: 'gold jewellery' },
    { label: t('home.popular.pressureCooker'), query: 'pressure cooker' },
    { label: t('home.popular.electricalSwitch'), query: 'electrical switch' }
  ];

  const services = [
    { title: t('home.services.findStandard.title'), icon: Search, bg: 'bg-blue-50', color: 'text-blue-600', path: '/standards', desc: t('home.services.findStandard.desc') },
    { title: t('home.services.certification.title'), icon: ShieldCheck, bg: 'bg-green-50', color: 'text-green-600', path: '/certification', desc: t('home.services.certification.desc') },
    { title: t('home.services.labs.title'), icon: FlaskConical, bg: 'bg-purple-50', color: 'text-purple-600', path: '/labs', desc: t('home.services.labs.desc') },
    { title: t('home.services.hallmarking.title'), icon: Diamond, bg: 'bg-amber-50', color: 'text-amber-600', path: '/hallmarking', desc: t('home.services.hallmarking.desc') },
    { title: t('home.services.consumerHelp.title'), icon: Users, bg: 'bg-sky-50', color: 'text-sky-600', path: '/consumer-help', desc: t('home.services.consumerHelp.desc') },
    { title: t('home.services.askSmartGuide.title'), icon: MessageCircle, bg: 'bg-indigo-50', color: 'text-indigo-600', path: '/ask', desc: t('home.services.askSmartGuide.desc') }
  ];

  const latestAnnouncement = announcements[0];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-[58%_42%] items-stretch bg-[#F4F8FF] rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[340px]">
        <div className="p-8 lg:pr-12 space-y-8 flex flex-col justify-center relative z-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              {t('home.welcome')} <span className="text-blue-700">{t('home.welcomeBrand')}</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('home.subtitle')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">{t('home.searchTitle')}</h3>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1 flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900 overflow-hidden">
                <div className="pl-3 pr-2 flex items-center justify-center text-slate-400">
                  <Search size={20} className="search-icon" />
                </div>
                <input
                  className="flex-1 py-3 pr-4 outline-none text-slate-900 bg-transparent placeholder-slate-400"
                  placeholder={t('home.searchPlaceholder')}
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!localQuery.trim()} className="bg-[#0A1A44] hover:bg-[#132A66] disabled:opacity-70 disabled:cursor-not-allowed text-white whitespace-nowrap px-6 h-[50px]">
                <span className="mr-2">✨</span> {t('home.findStandards')}
              </Button>
            </form>
            <div className="mt-5 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-bold text-slate-700 mr-1">{t('home.popularSearches')}</span>
              {popularSearches.map(item => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => handlePopularSearch(item.query)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="w-full h-48 sm:h-64 lg:h-full relative">
          {/* Subtle gradient to blend the left side into the image */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F4F8FF] to-transparent hidden lg:block z-10"></div>
          <img 
            src={bisBuildingImg} 
            alt="Bureau of Indian Standards" 
            className="w-full h-full object-cover object-[right_center] absolute inset-0"
          />
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Explore Services */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('home.exploreServices')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, idx) => (
                <Card 
                  key={idx} 
                  className="p-5 hover:shadow-md transition-shadow cursor-pointer border border-slate-200 hover:border-slate-300 flex flex-col group"
                  onClick={() => navigate(service.path)}
                >
                  <div className={`${service.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{service.title}</h3>
                  <p className="text-sm text-slate-500 flex-1">{service.desc}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-slate-600 group-hover:text-blue-600">
                    {t('home.exploreBtn')} <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">{t('home.howItWorks.title')}</h2>
              <p className="text-slate-600 mt-2">{t('home.howItWorks.subtitle')}</p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-blue-600">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">{t('home.howItWorks.step1Title')}</h4>
                  <p className="text-sm text-slate-500">{t('home.howItWorks.step1Desc')}</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-slate-300 hidden md:block" />
              <div className="flex-1 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-blue-600">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">{t('home.howItWorks.step2Title')}</h4>
                  <p className="text-sm text-slate-500">{t('home.howItWorks.step2Desc')}</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-slate-300 hidden md:block" />
              <div className="flex-1 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-green-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">{t('home.howItWorks.step3Title')}</h4>
                  <p className="text-sm text-slate-500">{t('home.howItWorks.step3Desc')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Why BIS SmartGuide */}
          <section>
            <Card className="p-8 border-l-4 border-l-blue-600 bg-white shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('home.whyBis.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{t('home.whyBis.point1')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{t('home.whyBis.point2')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{t('home.whyBis.point3')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{t('home.whyBis.point4')}</span>
                </div>
              </div>
            </Card>
          </section>

        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          
          {/* Recent Queries */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">{t('home.recentQueries')}</h3>
              <button onClick={() => navigate('/my-queries')} className="text-sm text-blue-600 hover:underline">{t('home.viewAll')}</button>
            </div>
            <div className="space-y-4">
              {recentQueries.slice(0, 3).map(query => (
                <div key={query.id} onClick={() => navigate('/my-queries')} className="group cursor-pointer">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {query.question}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{t('common.general')} • {query.date}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Announcement */}
          {latestAnnouncement && (
            <Card className="p-6 bg-amber-50 border-amber-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
              <h3 className="font-bold text-amber-900 mb-2">{t('home.announcement')}</h3>
              <p className="text-sm text-amber-800 font-medium mb-1">{latestAnnouncement.title}</p>
              <p className="text-sm text-amber-700 mb-3">{truncateText(latestAnnouncement.description, 80)}</p>
              <button className="text-sm font-semibold text-amber-900 flex items-center gap-1 hover:underline">
                {t('home.readMore')} <ArrowRight className="w-4 h-4" />
              </button>
            </Card>
          )}

          {/* BIS Resources */}
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">{t('home.bisResources')}</h3>
            <div className="space-y-3">
              <button onClick={() => navigate('/standards')} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group">
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{t('home.knowYourStandard')}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </button>
              <button onClick={() => navigate('/certification')} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group">
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{t('home.productCertification')}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </button>
              <button onClick={() => {}} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group">
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{t('home.bisCareApp')}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </button>
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
