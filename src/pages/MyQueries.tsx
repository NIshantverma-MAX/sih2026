import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SearchBar, Tabs, EmptyState } from '../components/ui';
import { QueryCard } from '../components/common/QueryCard';
import { MessageSquare } from 'lucide-react';

export default function MyQueries() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Mock data for queries
  const queries = [
    {
      id: '1',
      question: 'What is the BIS standard for drinking water?',
      answer: 'For packaged drinking water, IS 14543 standard must be followed. This is a mandatory certification under BIS.',
      date: new Date(Date.now() - 86400000).toISOString(),
      language: 'en' as const,
      status: 'answered' as const
    },
    {
      id: '2',
      question: 'How to verify hallmark on gold jewelry?',
      date: new Date(Date.now() - 172800000).toISOString(),
      language: 'en' as const,
      status: 'pending' as const
    }
  ];

  const renderQueries = (status: string) => {
    const filteredQueries = queries.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase());
      const matchesTab = status === 'all' || q.status === status;
      return matchesSearch && matchesTab;
    });

    if (filteredQueries.length === 0) {
      return (
        <EmptyState 
          icon={MessageSquare}
          title="No queries found"
          description="You haven't asked any questions yet or none match your search."
          action="Ask a Question"
          onAction={() => navigate('/ask')}
        />);
    }

    return (
      <div className="grid gap-4">
        {filteredQueries.map((query) => (
          <div key={query.id} onClick={() => navigate('/ask')} className="cursor-pointer">
            <QueryCard query={query} />
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: "all", label: "All Queries", content: renderQueries('all') },
    { id: "answered", label: "Answered", content: renderQueries('answered') },
    { id: "pending", label: "Pending", content: renderQueries('pending') }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Queries" 
        subtitle="View and manage your past queries" 
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:w-96">
          <SearchBar 
            value={search}
            onChange={setSearch}
            onSearch={() => {}} 
            placeholder="Search queries..." 
          />
        </div>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
