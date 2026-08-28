import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, RefreshCcw, Search } from "lucide-react";
import { useAppStore } from '../lib/store';
import { searchStandards, identifyProduct } from "../services/standardsService";
import { StandardCard } from '../components/common/StandardCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from "../components/ui/LoadingSkeleton";
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Modal } from '../components/ui/Modal';
import { Standard, StandardRecommendation } from "../types";

export default function Standards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const [localQuery, setLocalQuery] = useState(query);
  const [standards, setStandards] = useState<StandardRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [identifiedProduct, setIdentifiedProduct] = useState<any>(null);
  
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  
  // Filters state
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery) {
      setStandards([]);
      setIdentifiedProduct(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const [results, product] = await Promise.all([
        searchStandards(searchQuery),
        identifyProduct(searchQuery)
      ]);
      setStandards(results);
      setIdentifiedProduct(product);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch results'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLocalQuery(query);
    fetchResults(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery });
    } else {
      setSearchParams({});
    }
  };

  // Filtered standards
  const filteredStandards = standards.filter(std => {
    if (category && std.standard.category !== category) return false;
    if (status && std.standard.status !== status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Applicable Standards" 
        subtitle="Based on your product description" 
        backTo="/" 
        backLabel="Back to Home"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search and Filters */}
          <Card className="p-4 bg-white shadow-sm flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input 
                placeholder="Search standards..." 
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                className="w-full"
              />
              <Button type="submit" variant="primary">Search</Button>
            </form>
            <div className="flex gap-2">
              <select 
                className="h-10 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Electrical">Electrical</option>
                <option value="Household">Household</option>
                <option value="Food">Food</option>
                <option value="Construction">Construction</option>
              </select>
              <select
                className="h-10 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Revision">Under Revision</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </Card>

          {/* Product Identified Alert */}
          {identifiedProduct && !isLoading && !error && (
            <Card className="p-4 border-green-200 bg-green-50 shadow-sm flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-1">Product Identified</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-green-800">
                  <p><span className="font-medium">Name:</span> {identifiedProduct.name}</p>
                  <p><span className="font-medium">Category:</span> {identifiedProduct.category}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-white rounded-full w-12 h-12 border-2 border-green-200">
                <span className="text-xs font-bold text-green-700">{identifiedProduct.confidence}%</span>
              </div>
            </Card>
          )}

          {/* Results Area */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Recommended Standards {filteredStandards.length > 0 && <span className="text-slate-500 font-normal text-lg">({filteredStandards.length})</span>}
            </h2>
            
            {isLoading ? (
              <div className="space-y-4">
                <SkeletonCard className="h-40" />
                <SkeletonCard className="h-40" />
              </div>
            ) : error ? (
              <ErrorState 
                title="Error fetching standards" 
                description={error.message} 
                onRetry={() => fetchResults(query)} 
              />
            ) : !query ? (
              <EmptyState 
                icon={Search} 
                title="No search query" 
                description="Enter a product or standard in the search bar above to begin." 
              />
            ) : filteredStandards.length === 0 ? (
              <EmptyState 
                icon={Search} 
                title="No standards found" 
                description="We couldn't find any standards matching your query and filters. Try adjusting them." 
              />
            ) : (
              <div className="space-y-4">
                {filteredStandards.map(std => (
                  <StandardCard key={std.standard.id} standard={std.standard} relevance={std.relevance} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="p-5 bg-white shadow-sm border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">Why these standards?</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Product material matches</span>
              </li>
              <li className="flex gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Intended use matches</span>
              </li>
              <li className="flex gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Technical requirements align</span>
              </li>
              <li className="flex gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Relevant product category</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full text-sm" onClick={() => setShowAnalysisModal(true)}>
              View Detailed Analysis
            </Button>
          </Card>

          <Card className="p-5 bg-indigo-50 border-indigo-100 shadow-sm text-center">
            <AlertCircle className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <h3 className="font-bold text-indigo-900 mb-2">Need Help?</h3>
            <p className="text-sm text-indigo-700 mb-4">Ask follow-up questions about these standards or certification process.</p>
            <Button variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/ask')}>
              Ask AI Assistant
            </Button>
          </Card>
        </div>

      </div>

      <Modal isOpen={showAnalysisModal} onClose={() => setShowAnalysisModal(false)} title="AI Analysis Details">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Based on your query <span className="font-medium text-slate-900">"{query}"</span>, our AI identified the following mapping:</p>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-2">Extraction</h4>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li><strong>Product Type:</strong> LED Bulb</li>
              <li><strong>Application:</strong> General Lighting</li>
              <li><strong>Certification Context:</strong> Mandatory compliance for sale in India</li>
            </ul>
          </div>
          <p className="text-sm text-slate-600">The recommended standards were selected because they specifically cover the safety and performance requirements for self-ballasted LED lamps intended for general lighting services.</p>
        </div>
      </Modal>

    </div>
  );
}
