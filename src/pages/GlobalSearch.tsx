import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, FileText, ShieldCheck, FlaskConical, MessageCircle, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function GlobalSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader 
        title="Global Search Results" 
        subtitle={`Showing results across BIS SmartGuide for "${query}"`}
      />

      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Standards</h2>
          </div>
          <Card className="p-4">
            <p className="text-slate-600 mb-4">Search standards matching "{query}"</p>
            <Button onClick={() => navigate(`/standards?q=${encodeURIComponent(query)}`)} variant="outline" className="w-full justify-between group">
              View standard results <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-slate-800">Certification</h2>
          </div>
          <Card className="p-4">
            <p className="text-slate-600 mb-4">Find certification guidelines related to "{query}"</p>
            <Button onClick={() => navigate(`/certification`)} variant="outline" className="w-full justify-between group">
              Explore Certification Guide <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <FlaskConical className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-800">Testing Laboratories</h2>
          </div>
          <Card className="p-4">
            <p className="text-slate-600 mb-4">Find laboratories equipped for "{query}" testing.</p>
            <Button onClick={() => navigate(`/labs?q=${encodeURIComponent(query)}`)} variant="outline" className="w-full justify-between group">
              Search Laboratories <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">Ask SmartGuide</h2>
          </div>
          <Card className="p-4 bg-indigo-50 border-indigo-100">
            <p className="text-indigo-900 mb-4 font-medium">Want AI to answer your question directly?</p>
            <Button onClick={() => navigate(`/ask`)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white justify-between group">
              Ask AI about "{query}" <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
}
