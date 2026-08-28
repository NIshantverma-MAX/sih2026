import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Info, HelpCircle, FileText, ArrowRight } from "lucide-react";
import { useAppStore } from '../lib/store';
import { searchStandards, identifyProduct } from "../services/standardsService";
import { StandardCard } from '../components/common/StandardCard';
import { ProductIdentificationCard } from '../components/common/ProductIdentificationCard';
import { RelevanceExplanation } from '../components/common/RelevanceExplanation';
import { PageHeader } from '../components/ui/PageHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from "../components/ui/LoadingSkeleton";
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Modal } from '../components/ui/Modal';
import { StandardRecommendation, ProductIdentification, SearchFilters } from "../types";
import { useTranslation } from '../hooks/useTranslation';

export default function Standards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { isSaved, addSavedItem, removeSavedItem } = useAppStore();

  const [localQuery, setLocalQuery] = useState(query);
  const [standards, setStandards] = useState<StandardRecommendation[]>([]);
  const [productIdent, setProductIdent] = useState<ProductIdentification | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Filters and Sort
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sortParam, setSortParam] = useState('relevance');
  
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  useEffect(() => {
    setLocalQuery(query);
    if (query) {
      fetchResults(query);
    } else {
      setStandards([]);
      setProductIdent(null);
    }
  }, [query]);

  const fetchResults = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: SearchFilters = {};
      const [results, product] = await Promise.all([
        searchStandards(searchQuery, filters),
        identifyProduct(searchQuery)
      ]);
      setStandards(results);
      setProductIdent(product);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleProductUpdate = async (updated: Partial<ProductIdentification>) => {
    if (!productIdent) return;
    const newQuery = updated.name || localQuery;
    setLocalQuery(newQuery);
    setSearchParams({ q: newQuery });
    // In a real app, we would pass these explicit attributes to the backend
    setProductIdent({ ...productIdent, ...updated, isAmbiguous: false });
  };

  const toggleSave = (std: StandardRecommendation) => {
    if (isSaved(std.standard.id)) {
      removeSavedItem(std.standard.id);
    } else {
      addSavedItem({
        id: Date.now().toString(),
        itemId: std.standard.id,
        type: 'standard',
        title: std.standard.title,
        savedDate: new Date().toISOString()
      });
    }
  };

  // Filtering and Sorting
  let filteredStandards = standards.filter(std => {
    if (category && std.standard.category !== category) return false;
    if (status && std.standard.status !== status) return false;
    return true;
  });

  if (sortParam === 'az') {
    filteredStandards = [...filteredStandards].sort((a, b) => a.standard.title.localeCompare(b.standard.title));
  } else if (sortParam === 'recent') {
    filteredStandards = [...filteredStandards].sort((a, b) => b.standard.year - a.standard.year);
  } else if (sortParam === 'number') {
    filteredStandards = [...filteredStandards].sort((a, b) => a.standard.standardNumber.localeCompare(b.standard.standardNumber));
  }

  const primaryStandards = filteredStandards.filter(s => s.matchType === 'primary');
  const alternativeStandards = filteredStandards.filter(s => s.matchType !== 'primary');

  // Determine explanation reasons based on primary standard
  const activeReasons = primaryStandards.length > 0 ? primaryStandards[0].matchReasons : 
                        filteredStandards.length > 0 ? filteredStandards[0].matchReasons : [];
  const activeEvidence = primaryStandards.length > 0 ? primaryStandards[0].evidenceIds : undefined;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Standards Discovery" 
        subtitle="Identify and understand applicable Indian Standards" 
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
                placeholder="Search by product, material, or IS number..." 
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                className="w-full"
              />
              <Button type="submit" variant="primary">Search</Button>
            </form>
            <div className="flex flex-wrap gap-2">
              <select 
                className="h-10 px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Electrical / Lighting">Electrical / Lighting</option>
                <option value="Household / Food Contact Articles">Household / Food</option>
                <option value="Construction / Building Materials">Construction</option>
              </select>
              <select
                className="h-10 px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortParam}
                onChange={e => setSortParam(e.target.value)}
              >
                <option value="relevance">Most Relevant</option>
                <option value="recent">Recently Updated</option>
                <option value="az">A-Z</option>
                <option value="number">Standard Number</option>
              </select>
            </div>
          </Card>

          {isLoading ? (
            <div className="space-y-4">
              <SkeletonCard className="h-24" />
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
            <Card className="p-8 border-dashed border-2 border-slate-300 bg-slate-50 text-center">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Find the right Indian Standard</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Describe your product, its material, intended use, or search directly by an IS number.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/standards?q=stainless steel water bottle')}>"Stainless steel bottle"</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/standards?q=LED bulb')}>"LED bulb"</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/standards?q=IS 302')}>"IS 302"</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/standards?q=cement')}>"Cement"</Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              
              {productIdent && (
                <ProductIdentificationCard 
                  product={productIdent} 
                  onUpdate={handleProductUpdate} 
                />
              )}

              {filteredStandards.length === 0 && !productIdent?.isAmbiguous ? (
                <EmptyState 
                  icon={Search} 
                  title="No standards found" 
                  description="We couldn't find any standards matching your query and filters. Try adjusting them." 
                />
              ) : (
                <>
                  {primaryStandards.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        Primary Recommendations 
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs py-0.5 px-2 rounded-full">{primaryStandards.length}</span>
                      </h2>
                      <div className="space-y-4">
                        {primaryStandards.map(std => (
                          <StandardCard 
                            key={std.standard.id} 
                            standard={std.standard} 
                            relevance={std.relevance}
                            relevanceScore={std.relevanceScore}
                            isBookmarked={isSaved(std.standard.id)}
                            onBookmark={() => toggleSave(std)}
                            onViewDetails={() => navigate(`/standards/${std.standard.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {alternativeStandards.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
                        Alternative & Related Standards 
                        <span className="ml-2 bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full">{alternativeStandards.length}</span>
                      </h2>
                      <div className="space-y-4 opacity-90">
                        {alternativeStandards.map(std => (
                          <StandardCard 
                            key={std.standard.id} 
                            standard={std.standard} 
                            relevance={std.relevance}
                            isBookmarked={isSaved(std.standard.id)}
                            onBookmark={() => toggleSave(std)}
                            onViewDetails={() => navigate(`/standards/${std.standard.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <RelevanceExplanation 
            matchReasons={activeReasons} 
            evidenceIds={activeEvidence}
            onViewDetails={activeReasons.length > 0 ? () => setShowAnalysisModal(true) : undefined}
          />

          <Card className="p-5 bg-indigo-50 border-indigo-100 shadow-sm text-center">
            <HelpCircle className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <h3 className="font-bold text-indigo-900 mb-2">Need Help?</h3>
            <p className="text-sm text-indigo-700 mb-4">Unsure which standard applies? Ask our intelligent assistant.</p>
            <Button variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/ask')}>
              Ask SmartGuide
            </Button>
          </Card>
        </div>

      </div>

      <Modal isOpen={showAnalysisModal} onClose={() => setShowAnalysisModal(false)} title="Detailed AI Analysis">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Based on your query <span className="font-medium text-slate-900">"{query}"</span>, our AI identified the following mapping:</p>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-2">Extraction</h4>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li><strong>Product Match:</strong> {productIdent?.name}</li>
              <li><strong>Category:</strong> {productIdent?.category}</li>
              {productIdent?.intendedUse && <li><strong>Intended Use:</strong> {productIdent?.intendedUse}</li>}
            </ul>
          </div>
          <p className="text-sm text-slate-600">The primary recommended standards were selected because their official BIS scope specifically covers these extracted properties. This recommendation is AI-assisted and should be verified against official BIS documentation.</p>
        </div>
      </Modal>

    </div>
  );
}
