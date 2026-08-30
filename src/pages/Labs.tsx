import React, { useState, useEffect } from 'react';
import { useTranslation } from "../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import { PageHeader } from '../components/ui/PageHeader';
import { LaboratoryCard } from '../components/common/LaboratoryCard';
import { SearchBar } from '../components/ui/SearchBar';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import { Select } from '../components/ui/Select';
import { searchLaboratories } from '../services/laboratoryService';
import { Laboratory } from '../types';

export default function Labs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');

  const fetchLabs = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchLaboratories({
        query: searchQuery || undefined,
        state: selectedState === 'all' ? undefined : selectedState || undefined,
        standard: selectedStandard === 'all' ? undefined : selectedStandard || undefined
      });
      setLabs(results);
    } catch (err) {
      setError(t('labs.errorDesc') || 'Failed to load laboratories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedStandard]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchLabs();
  };

  const stateOptions = [
    { value: 'all', label: t('labs.allStates') || 'All States' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'tamil nadu', label: 'Tamil Nadu' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'uttar pradesh', label: 'Uttar Pradesh' },
  ];

  const standardOptions = [
    { value: 'all', label: t('labs.allStandards') || 'All Standards' },
    { value: 'IS 17803:2022', label: 'IS 17803:2022' },
    { value: 'IS 9873', label: 'IS 9873 (Toys)' },
    { value: 'IS 14625', label: 'IS 14625 (Plastics)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col mb-8">
        <PageHeader 
          title={t("labs.title") || "BIS Recognized Testing Laboratories"}
          subtitle={t("labs.subtitle") || "For Standard: IS 17803:2022"}
        />
        <p className="text-xs text-gray-400 mt-2 italic">
          {t("labs.prototypeData") || "Prototype data — replace with official BIS laboratory data."}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={() => fetchLabs()} 
            placeholder={t("labs.searchPlaceholder") || "Search by city or lab name..."} 
          />
        </div>
        <div className="w-full sm:w-48">
          <Select 
            options={stateOptions}
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select 
            options={standardOptions}
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600 font-medium">
        {!loading && !error && `Showing ${labs.length} result${labs.length !== 1 ? 's' : ''}`}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && !loading && (
        <ErrorState 
          title={t("labs.errorTitle") || "Error Loading Laboratories"} 
          description={error} 
          onRetry={fetchLabs} 
        />
      )}

      {!loading && !error && labs.length === 0 && (
        <EmptyState 
          icon={FlaskConical} 
          title={t("labs.emptyTitle") || "No laboratories found"} 
          description={t("labs.emptyDesc") || "Try adjusting your filters or search query to find relevant testing laboratories."} 
        />
      )}

      {!loading && !error && labs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map(lab => (
            <LaboratoryCard 
              key={lab.id} 
              lab={lab as any} // Using as any to bypass recognized vs isRecognized type discrepancy
              onViewDetails={() => navigate(`/labs/${lab.id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
