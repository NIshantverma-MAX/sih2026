import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { ArrowLeft, CheckCircle, BookmarkPlus, BookmarkMinus, FileText, ExternalLink, ShieldCheck, Microscope, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { getStandard, getRelatedStandards, getLatestVersion } from '../services/standardsService';
import { Standard } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { SourceList } from '../components/common/SourceList';
import { sources as mockSources } from "../data/sources";
import { formatDate } from '../utils/helpers';

export default function StandardDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaved, addSavedItem, removeSavedItem } = useAppStore();
  
  const [standard, setStandard] = useState<Standard | null>(null);
  const [relatedStandards, setRelatedStandards] = useState<Standard[]>([]);
  const [latestVersion, setLatestVersion] = useState<Standard | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const saved = isSaved(id || '');

  useEffect(() => {
    const fetchStandard = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const [stdData, relatedData, latestData] = await Promise.all([
          getStandard(id),
          getRelatedStandards(id),
          getLatestVersion(id)
        ]);
        setStandard(stdData || null);
        setRelatedStandards(relatedData);
        setLatestVersion(latestData);
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
          <h3 className="text-lg font-semibold text-slate-900">{t("standardDetails.scope") || "Scope"}</h3>
          <p className="text-slate-700 leading-relaxed">{standard.description}</p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
            <h4 className="font-medium text-slate-900 mb-2">{t("standardDetails.techScope") || "Technical Scope:"}</h4>
            <p className="text-slate-700">{standard.scope}</p>
          </div>
        </div>
      )
    },
    {
      id: 'requirements',
      label: 'Key Requirements',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">{t("standardDetails.extractedRequirements") || "Extracted Requirements"}</h3>
          <ul className="space-y-3">
            {standard.keyRequirements?.length > 0 ? (
              standard.keyRequirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{req}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">{t("standardDetails.noRequirements") || "No specific requirements extracted for this prototype."}</li>
            )}
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

      {latestVersion && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">{t("standardDetails.newerVersion") || "A newer version of this standard is available."}</p>
              <p className="text-xs text-blue-700">{t("standardDetails.underRevision") || "This standard is currently under revision."}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white" onClick={() => navigate(`/standards/${latestVersion.id}`)}>
            View Latest Version
          </Button>
        </div>
      )}

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{standard.standardNumber}</h1>
              <Badge variant={standard.status === 'active' ? 'success' : standard.status === 'withdrawn' ? 'error' : 'warning'}>
                {standard.status.toUpperCase()}
              </Badge>
              <Badge variant={standard.certificationStatus === 'mandatory' ? 'warning' : 'info'}>
                {standard.certificationStatus === 'mandatory' ? 'MANDATORY CERTIFICATION' : 'VOLUNTARY CERTIFICATION'}
              </Badge>
            </div>
            <h2 className="text-xl text-slate-700 font-medium">{standard.title}</h2>
          </div>
          <Button 
            variant="outline" 
            className="flex-shrink-0"
            onClick={toggleSave}
          >
            {saved ? (
              <><BookmarkMinus className="w-4 h-4 mr-2 text-blue-600" /> {t("standardDetails.saved") || "Saved"}</>
            ) : (
              <><BookmarkPlus className="w-4 h-4 mr-2" /> {t("standardDetails.saveStandard") || "Save Standard"}</>
            )}
          </Button>
        </div>

        {/* Action Bridge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            onClick={() => navigate(`/certification?standardId=${standard.id}`)}
          >
            <ShieldCheck className="w-6 h-6 text-blue-600 mb-2" />
            <span className="font-semibold text-slate-900">{t("standardDetails.certGuidance") || "Certification Guidance"}</span>
            <span className="text-xs text-slate-500 mt-1">Check schemes & requirements</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-auto border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
            onClick={() => navigate(`/labs?standardId=${standard.id}`)}
          >
            <Microscope className="w-6 h-6 text-indigo-600 mb-2" />
            <span className="font-semibold text-slate-900">{t("standardDetails.findLabs") || "Find Testing Labs"}</span>
            <span className="text-xs text-slate-500 mt-1">{t("standardDetails.authFacilities") || "Authorized testing facilities"}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-auto border-purple-200 hover:bg-purple-50 hover:border-purple-300"
            onClick={() => navigate('/ask')}
          >
            <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
            <span className="font-semibold text-slate-900">{t("standardDetails.askSmartGuide") || "Ask SmartGuide"}</span>
            <span className="text-xs text-slate-500 mt-1">{t("standardDetails.chatAbout") || "Chat about this standard"}</span>
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
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("standardDetails.officialSources") || "Official Sources"}</h3>
            <p className="text-sm text-slate-600 mb-4">The information above is extracted from the following authoritative BIS documents:</p>
            <SourceList sources={mockSources.slice(0, 2)} />
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
              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span className="text-slate-500 font-medium">Certification</span>
                <span className="font-medium text-slate-900">{standard.certificationStatus === 'mandatory' ? 'Mandatory' : 'Voluntary'}</span>
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
                    className="p-3 border border-slate-200 rounded-lg bg-white hover:border-blue-400 cursor-pointer transition-colors shadow-sm"
                    onClick={() => navigate(`/standards/${rel.id}`)}
                  >
                    <p className="font-semibold text-blue-700 text-sm">{rel.standardNumber}</p>
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
