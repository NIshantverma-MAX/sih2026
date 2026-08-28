import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BookmarkPlus, BookmarkMinus, CheckCircle, FileText } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { getStandard, getRelatedStandards } from "../services/standardsService";
import { Standard } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { SkeletonCard } from "../components/ui/LoadingSkeleton";
import { ErrorState } from '../components/ui/ErrorState';
import { StandardCard } from '../components/common/StandardCard';
import { SourceList } from '../components/common/SourceList';
import { sources as mockSources } from "../data/sources";
import { formatDate } from '../utils/helpers';

export default function StandardDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaved, addSavedItem, removeSavedItem } = useAppStore();
  
  const [standard, setStandard] = useState<Standard | null>(null);
  const [relatedStandards, setRelatedStandards] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const saved = isSaved(id || '');

  useEffect(() => {
    const fetchStandard = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const [stdData, relatedData] = await Promise.all([
          getStandard(id),
          getRelatedStandards(id)
        ]);
        setStandard(stdData || null);
        setRelatedStandards(relatedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Standard not found'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandard();
  }, [id]);

  const toggleSave = () => {
    if (!standard) return;
    if (saved) {
      removeSavedItem(standard.id);
    } else {
      addSavedItem({
        id: Date.now().toString(),
        itemId: standard.id,
        type: 'standard',
        title: standard.title,
        savedDate: new Date().toISOString()
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-8 w-32" />
        <SkeletonCard className="h-32 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard className="h-64 lg:col-span-2" />
          <SkeletonCard className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !standard) {
    return <ErrorState title="Standard Not Found" description="The standard you are looking for does not exist or an error occurred." onRetry={() => navigate('/standards')} />;
  }

  const tabs = [
    {
      id: 'scope',
      label: 'Scope & Overview',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Scope</h3>
          <p className="text-slate-700 leading-relaxed">{standard.description}</p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
            <h4 className="font-medium text-slate-900 mb-2">Key Areas Covered:</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>General safety requirements</li>
              <li>Performance testing methodology</li>
              <li>Marking and labelling instructions</li>
              <li>Sampling plans for acceptance</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'requirements',
      label: 'Key Requirements',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Mandatory Requirements</h3>
          <ul className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Detailed requirement {i} extracted from the standard documentation regarding safety and compliance.</span>
              </li>
            ))}
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Results
      </button>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{standard.standardNumber}</h1>
              {standard.status === 'active' && <Badge variant="success">Active</Badge>}
              {standard.certificationStatus === 'mandatory' && <Badge variant="warning">Mandatory Certification</Badge>}
            </div>
            <h2 className="text-xl text-slate-700 font-medium">{standard.title}</h2>
          </div>
          <Button 
            variant="outline" 
            className="flex-shrink-0"
            onClick={toggleSave}
          >
            {saved ? (
              <><BookmarkMinus className="w-4 h-4 mr-2" /> Remove Bookmark</>
            ) : (
              <><BookmarkPlus className="w-4 h-4 mr-2" /> Save Standard</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <Tabs tabs={tabs} />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Official Sources</h3>
            <SourceList sources={mockSources} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-50 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 border-b pb-2">Standard Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Standard No.</span>
                <span className="font-medium text-slate-900">{standard.standardNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Year</span>
                <span className="font-medium text-slate-900">{standard.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category</span>
                <span className="font-medium text-slate-900">{standard.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-medium text-slate-900">{standard.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-medium text-slate-900">{formatDate(new Date().toISOString())}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="primary" className="w-full flex justify-center items-center gap-2">
                <FileText className="w-4 h-4" /> View Full Standard (BIS) <ExternalLink className="w-4 h-4" />
              </Button>
              <p className="text-xs text-slate-500 text-center mt-2">Redirects to official BIS portal</p>
            </div>
          </Card>

          {relatedStandards.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Related Standards</h3>
              <div className="space-y-4">
                {relatedStandards.map(rel => (
                  <div 
                    key={rel.id}
                    className="p-3 border border-slate-100 rounded-lg bg-white hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => navigate(`/standards/${rel.id}`)}
                  >
                    <p className="font-medium text-blue-600 text-sm">{rel.standardNumber}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{rel.title}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
