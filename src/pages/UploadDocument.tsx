import React, { useState } from 'react';
import { useTranslation } from "../hooks/useTranslation";
import { PageHeader, Button, Card, Badge } from '../components/ui';
import { FileUploader } from '../components/common/FileUploader';
import { uploadDocument, getDocumentResult } from '../services/documentService';
import { DocumentAnalysis, UploadedDocument } from '../types';
import toast from 'react-hot-toast';
import { CheckCircle2, AlertTriangle, FileText, Loader2 } from 'lucide-react';

export default function UploadDocument() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<'idle' | 'uploading' | 'analyzing' | 'complete'>('idle');
  const [progressText, setProgressText] = useState('');
  const [result, setResult] = useState<DocumentAnalysis | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setStage('uploading');
      setProgressText('Uploading...');
      
      const doc = await uploadDocument(file);
      
      setStage('analyzing');
      setProgressText('Extracting text...');
      setTimeout(() => setProgressText('Analyzing content...'), 1500);
      setTimeout(() => setProgressText('Finding relevant standards...'), 3000);
      
      const analysis = await getDocumentResult(doc.id);
      
      setResult(analysis);
      setStage('complete');
      toast.success('Document analyzed successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze document.');
      setStage('idle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Upload Product / Technical Document" 
        subtitle="Upload a document and we'll analyze it for relevant standards and requirements." 
      />

      {stage === 'idle' && (
        <Card className="p-8 border-dashed border-2 border-gray-300">
          {!file ? (
            <FileUploader 
              onFileSelect={setFile} 
              maxSize={10 * 1024 * 1024}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="w-16 h-16 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">{file.name}</h3>
              <p className="text-sm text-gray-500 mb-6">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setFile(null)}>
                  Remove File
                </Button>
                <Button onClick={handleUpload} className="bg-blue-900 text-white">
                  Analyze Document
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {(stage === 'uploading' || stage === 'analyzing') && (
        <Card className="p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Document</h3>
            <p className="text-gray-500">{progressText}</p>
          </div>
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: stage === 'uploading' ? '30%' : '75%' }}></div>
          </div>
        </Card>
      )}

      {stage === 'complete' && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
            <Button variant="outline" onClick={() => { setFile(null); setStage('idle'); setResult(null); }}>
              Upload Another
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-blue-100 bg-blue-50/50">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-blue-600" />
                Product Identification
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Extracted Text Sample:</span>
                  <p className="font-medium text-gray-900 line-clamp-2">{result.productIdentified}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Compliance Status:</span>
                  <div className="mt-1">
                    <Badge variant={result.warnings.length > 0 ? 'warning' : 'success'}>
                      {result.warnings.length === 0 ? 'COMPLIANT' : 'ISSUES FOUND'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                Key Requirements & Missing Info
              </h3>
              <div className="space-y-4">
                {result.warnings && result.warnings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Missing Information:</h4>
                    <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                      {result.warnings.map((info: string, idx: number) => (
                        <li key={idx}>{info}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Requirements Found:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {result.certificationRequirements.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-6">
             <h3 className="font-semibold text-gray-900 mb-4">Identified Standards</h3>
             <div className="flex flex-wrap gap-2">
               {result.relevantStandards.map((std: any, idx: number) => (
                 <Badge key={idx} variant="default" className="text-sm px-3 py-1">{std}</Badge>
               ))}
             </div>
          </Card>
        </div>
      )}
    </div>
  );
}
