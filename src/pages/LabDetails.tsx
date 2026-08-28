import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, Mail, Globe, Clock, Award, ExternalLink, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { getLaboratory } from '../services/laboratoryService';
import { Laboratory } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';

export default function LabDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lab, setLab] = useState<Laboratory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchLab = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getLaboratory(id);
        if (data) {
          setLab(data);
        } else {
          setError('Laboratory not found.');
        }
      } catch (err) {
        setError('Failed to load laboratory details.');
      } finally {
        setLoading(false);
      }
    };

    fetchLab();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonCard />
        <SkeletonCard />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error || !lab) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/labs" className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-700">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Laboratories
          </Link>
        </div>
        <ErrorState 
          title="Laboratory Not Found" 
          description={error || "The requested laboratory could not be found."} 
          onRetry={() => navigate('/labs')}
        />
      </div>
    );
  }

  // Address is usually an object in the mock data, or a string in types. 
  // Let's handle both for safety.
  const addressText = typeof lab.address === 'object' 
    ? `${(lab.address as any).street}, ${(lab.address as any).city}, ${(lab.address as any).state} - ${(lab.address as any).pincode}`
    : lab.address;

  // Same for supportedStandards (might be testingScope in data)
  const standards = lab.supportedStandards || (lab as any).testingScope || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/labs" className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Laboratories
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{lab.name}</h1>
              {((lab as any).isRecognized || lab.recognized) && (
                <Badge variant="success" className="px-3 py-1 text-sm">
                  <Award className="w-4 h-4 mr-1.5" />
                  BIS Recognized
                </Badge>
              )}
            </div>
            <p className="text-gray-600 max-w-3xl">
              An officially recognized laboratory for testing and certifying products according to BIS standards.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-[240px]">
            <Button 
              className="w-full flex justify-center items-center" 
              onClick={() => window.location.href = `mailto:${lab.email}`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Laboratory
            </Button>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1 px-0" title="Open Official Record">
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button 
                variant={isSaved ? "secondary" : "outline"} 
                className="flex-1 px-0"
                onClick={() => setIsSaved(!isSaved)}
                title={isSaved ? "Saved" : "Save Laboratory"}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 text-blue-900" /> : <BookmarkPlus className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600 mt-1">{addressText}</p>
                </div>
              </div>
              
              {lab.phone && (
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600 mt-1">{lab.phone}</p>
                  </div>
                </div>
              )}
              
              {lab.email && (
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a href={`mailto:${lab.email}`} className="text-sm text-blue-700 hover:underline mt-1">{lab.email}</a>
                  </div>
                </div>
              )}
              
              {lab.website && (
                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Website</p>
                    <a href={lab.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline mt-1">
                      {lab.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
              
              {lab.workingHours && (
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Working Hours</p>
                    <p className="text-sm text-gray-600 mt-1">{lab.workingHours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 md:p-8 bg-gray-50 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Map Placeholder</h3>
            <p className="text-xs text-gray-500 max-w-xs">
              Integrate with mapping service to show location for coordinates:
              <br/>
              {lab.coordinates ? `${lab.coordinates.lat}, ${lab.coordinates.lng}` : 'Not available'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Supported Standards</h2>
          {standards.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {standards.map((standard, index) => (
                <Badge key={index} variant="default" className="px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-200" onClick={() => navigate(`/standards/${standard.replace(/\s+/g, '-').toLowerCase()}`)}>
                  {standard}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No specific standards listed.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Testing Categories</h2>
          {lab.testingCategories && lab.testingCategories.length > 0 ? (
            <ul className="space-y-3">
              {lab.testingCategories.map((category, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-md border border-gray-100">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mr-3"></div>
                  {category}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No specific testing categories listed.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
