import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, FileText, Settings, FlaskConical, ClipboardList, BookOpen, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CertificationStepper } from '../components/common/CertificationStepper';
import { SourceList } from '../components/common/SourceList';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { cn } from '../utils/helpers';

export default function Certification() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isQcoModalOpen, setIsQcoModalOpen] = useState(false);

  // Hardcoded steps based on requirement
  const steps = [
    { id: '1', title: 'Identify Standard', status: activeStep > 0 ? 'completed' : 'current' },
    { id: '2', title: 'Check Requirement', status: activeStep > 1 ? 'completed' : activeStep === 1 ? 'current' : 'upcoming' },
    { id: '3', title: 'Prepare', status: activeStep > 2 ? 'completed' : activeStep === 2 ? 'current' : 'upcoming' },
    { id: '4', title: 'Testing', status: activeStep > 3 ? 'completed' : activeStep === 3 ? 'current' : 'upcoming' },
    { id: '5', title: 'Application', status: activeStep > 4 ? 'completed' : activeStep === 4 ? 'current' : 'upcoming' },
    { id: '6', title: 'Assessment', status: activeStep > 5 ? 'completed' : activeStep === 5 ? 'current' : 'upcoming' },
    { id: '7', title: 'Certification', status: activeStep > 6 ? 'completed' : activeStep === 6 ? 'current' : 'upcoming' },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center text-sm text-gray-500 space-x-2">
        <Link to="/" className="hover:text-blue-900 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Certification</span>
      </div>

      <PageHeader 
        title="Certification Guide"
        subtitle="Process to get BIS certification for your product"
      />

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <CertificationStepper 
          steps={steps as any} 
          activeStep={activeStep} 
          onStepClick={(index) => setActiveStep(index)} 
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            {activeStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-blue-900">
                  <BookOpen className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Step 1: Identify Standard</h2>
                </div>
                <p className="text-gray-600">You have identified the applicable standard for your product.</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900">Applicable Standard</h3>
                    <p className="text-green-800 text-sm">IS 17803:2022 - Stainless Steel Vacuum Insulated Flask</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                  <p className="text-gray-600 text-sm">Check whether BIS certification is mandatory or voluntary for your product based on applicable government orders and regulations.</p>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-blue-900">
                  <ClipboardList className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Step 2: Check Requirement</h2>
                </div>
                <p className="text-gray-600">Ensure all preliminary checks are completed before proceeding.</p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> <span>Identify applicable standard</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> <span>Check whether a QCO applies</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> <span>Check product-specific certification information</span>
                  </li>
                </ul>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-blue-900">
                  <Settings className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Step 3: Prepare</h2>
                </div>
                <p className="text-gray-600">Gather necessary documents and ensure your manufacturing unit is ready.</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li>Manufacturing information</li>
                  <li>Quality control capabilities</li>
                  <li>Testing capability</li>
                  <li>Required documents (Company registration, manufacturing process flow, etc.)</li>
                </ul>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Documents Needed</h4>
                  <p className="text-sm text-blue-800">Business License, Layout Plan, List of Machinery, Details of QC Staff.</p>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-blue-900">
                  <FlaskConical className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Step 4: Testing</h2>
                </div>
                <p className="text-gray-600">Product samples must be tested in a BIS recognized laboratory.</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-6">
                  <li>Identify applicable tests from the standard</li>
                  <li>Find a BIS-recognized testing laboratory</li>
                  <li>Get product samples tested</li>
                  <li>Obtain test report</li>
                </ul>
                <Button onClick={() => navigate('/labs')}>Find Testing Labs</Button>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-blue-900">
                  <FileText className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Step 5: Application</h2>
                </div>
                <p className="text-gray-600">Submit your application via the official BIS portal.</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li>Complete BIS application form</li>
                  <li>Attach required documents</li>
                  <li>Pay application fees</li>
                  <li>Submit online via BIS portal</li>
                </ul>
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 italic">Note: Application fees vary depending on the product category and standard.</p>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-blue-900">
                  <ShieldCheck className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Step 6: Assessment</h2>
                </div>
                <p className="text-gray-600">BIS officials will review your application and inspect your factory.</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li>Factory inspection</li>
                  <li>Quality system evaluation</li>
                  <li>Product sample testing</li>
                  <li>Compliance verification</li>
                </ul>
              </div>
            )}

            {activeStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-blue-900">
                  <CheckCircle2 className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Step 7: Certification</h2>
                </div>
                <p className="text-gray-600">Once approved, you will be granted a licence to use the Standard Mark.</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li>Receive BIS licence</li>
                  <li>Use ISI mark on products</li>
                  <li>Comply with ongoing surveillance</li>
                  <li>Renew licence periodically</li>
                </ul>
                <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg font-medium text-center">
                  Success! You have reviewed all steps of the certification process.
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-100">
              <Button variant="outline" onClick={handlePrev} disabled={activeStep === 0}>
                Previous Step
              </Button>
              <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
                Next Step
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-l-4 border-l-orange-500 border-t border-r border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Is Certification Mandatory?</h3>
            <p className="text-sm text-gray-600 mb-4">
              BIS certification is generally voluntary. However, certain products are made mandatory through Government Orders (QCOs). Please check the latest QCO list or consult BIS for your product category.
            </p>
            <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => setIsQcoModalOpen(true)}>
              Check QCO List
            </Button>
          </Card>
          
          <div className="pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Helpful Resources</h4>
            <SourceList 
              sources={[
                { id: '1', title: 'BIS Conformity Assessment', type: 'regulation', url: '#', documentName: 'Scheme I' },
                { id: '2', title: 'Product Manual for IS 17803', type: 'guideline', url: '#', documentName: 'PM/17803' }
              ]} 
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isQcoModalOpen} onClose={() => setIsQcoModalOpen(false)} title="Quality Control Orders (QCO)">
        <div className="p-4">
          <p className="text-gray-700 mb-4">
            Quality Control Orders (QCOs) are issued by the Government of India to make BIS certification mandatory for specific products in the public interest.
          </p>
          <p className="text-sm text-gray-500">
            This is a placeholder for the QCO list integration.
          </p>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setIsQcoModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
