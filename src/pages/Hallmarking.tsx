import React, { useState } from 'react';
import { 
  Diamond, 
  Info, 
  Store, 
  Building, 
  Smartphone, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { verifyHUID } from '../services/hallmarkingService';
import { HUIDVerification } from '../types';
import { cn } from '../utils/helpers';

export default function Hallmarking() {
  const [huidInput, setHuidInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<HUIDVerification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!huidInput.trim() || huidInput.trim().length !== 6) {
      setError('Please enter a valid 6-character alphanumeric HUID.');
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    setVerificationResult(null);

    try {
      const result = await verifyHUID(huidInput.toUpperCase());
      setVerificationResult(result);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader 
        title="Hallmarking"
        subtitle="Verify HUID or learn about hallmarking."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Verify HUID Card */}
        <Card className="p-6 md:p-8 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900">
              <Diamond className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verify HUID</h2>
          </div>
          
          <p className="text-sm text-gray-600 mb-6 flex-1">
            Enter the 6-character alphanumeric code marked on your gold jewellery to verify its authenticity.
          </p>
          
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <Input 
                value={huidInput}
                onChange={(e) => setHuidInput(e.target.value)}
                placeholder="e.g., A1B2C3"
                className="pl-10 uppercase font-mono tracking-widest text-lg"
                maxLength={6}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            </div>
            
            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isVerifying || huidInput.trim().length === 0}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
        </Card>

        {/* About Hallmarking Card */}
        <Card className="p-6 md:p-8 flex flex-col h-full bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
              <Info className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">About Hallmarking</h2>
          </div>
          
          <p className="text-white/90 mb-8 flex-1 leading-relaxed">
            Know about the hallmarking process, its benefits, and how it protects consumers from adulteration and ensures purity of gold.
          </p>
          
          <Button 
            variant="outline" 
            className="w-full border-white text-blue-900 bg-white hover:bg-gray-50"
            onClick={() => {
              document.getElementById('hallmarking-info')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn More
          </Button>
        </Card>
      </div>

      {/* Verification Result Section */}
      {verificationResult && (
        <div className={cn(
          "rounded-xl border p-6 md:p-8 shadow-sm transition-all duration-300",
          (verificationResult as any).isValid || verificationResult.verified ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        )}>
          <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-4">
              {((verificationResult as any).isValid || verificationResult.verified) ? (
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              )}
              <div>
                <h3 className={cn(
                  "text-xl font-bold",
                  ((verificationResult as any).isValid || verificationResult.verified) ? "text-green-900" : "text-red-900"
                )}>
                  {((verificationResult as any).isValid || verificationResult.verified) ? 'HUID Verified Successfully' : 'HUID Not Found'}
                </h3>
                <p className={cn(
                  "text-sm font-mono mt-1",
                  ((verificationResult as any).isValid || verificationResult.verified) ? "text-green-700" : "text-red-700"
                )}>
                  Number: {verificationResult.huid}
                </p>
              </div>
            </div>
          </div>

          {((verificationResult as any).isValid || verificationResult.verified) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-5 rounded-lg border border-green-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">Product</p>
                <p className="font-semibold text-gray-900">{verificationResult.product || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Purity</p>
                <p className="font-semibold text-gray-900">{verificationResult.purity || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Jeweller</p>
                <p className="font-semibold text-gray-900 truncate" title={verificationResult.jeweller}>{verificationResult.jeweller || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Hallmarking Date</p>
                <p className="font-semibold text-gray-900">{verificationResult.date || 'N/A'}</p>
              </div>
            </div>
          )}

          {!((verificationResult as any).isValid || verificationResult.verified) && (
            <div className="bg-white p-5 rounded-lg border border-red-100">
              <p className="text-red-800 text-sm">
                {(verificationResult as any).message || 'This HUID does not exist in our database. Please ensure you have entered it correctly.'}
              </p>
            </div>
          )}
          
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <AlertCircle className="w-4 h-4 mr-1.5" />
            This is a prototype verification. For official verification, use the BIS Care App or visit the BIS portal.
          </div>
        </div>
      )}

      {/* Find Services Section */}
      <div className="pt-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Find Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Store, title: 'Registered Jewellers', desc: 'Find BIS registered jewellers near you', bg: 'bg-amber-50', text: 'text-amber-700' },
            { icon: Building, title: 'Assaying Centres', desc: 'Locate A&H centres', bg: 'bg-emerald-50', text: 'text-emerald-700' },
            { icon: Smartphone, title: 'BIS Care App', desc: 'Download official app', bg: 'bg-blue-50', text: 'text-blue-700' },
            { icon: MessageSquare, title: 'Complaints', desc: 'Register a grievance', bg: 'bg-purple-50', text: 'text-purple-700' },
          ].map((service, idx) => (
            <Card key={idx} className="p-5 hover:border-blue-900 hover:shadow-md transition-all cursor-pointer group">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors", service.bg, service.text)}>
                <service.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors">{service.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{service.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* About Hallmarking Detailed Section */}
      <div id="hallmarking-info" className="pt-8 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Hallmarking</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">What is Hallmarking?</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Hallmarking is the accurate determination and official recording of the proportionate content of precious metal in precious metal articles. Hallmarks are thus official marks used in many countries as a guarantee of purity or fineness of precious metal articles.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              In India, BIS operates a hallmarking scheme for Gold and Silver jewellery. The objective is to protect the public against adulteration and to obligate manufacturers to maintain legal standards of fineness.
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Components of Hallmark</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0 text-xs font-bold mr-3 mt-0.5">1</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">BIS Logo</p>
                  <p className="text-xs text-gray-500 mt-1">Indicates that the jewellery meets BIS standards.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0 text-xs font-bold mr-3 mt-0.5">2</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Purity Grade (e.g., 22K916)</p>
                  <p className="text-xs text-gray-500 mt-1">Shows the carat and fineness (91.6% gold).</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0 text-xs font-bold mr-3 mt-0.5">3</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">6-digit HUID Code</p>
                  <p className="text-xs text-gray-500 mt-1">Hallmark Unique Identification number for traceability.</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
