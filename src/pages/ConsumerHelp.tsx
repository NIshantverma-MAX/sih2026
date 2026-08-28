import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card } from '../components/ui';
import { ShieldCheck, Award, Diamond, Hash, FileSearch, AlertTriangle, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConsumerHelp() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const services = [
    {
      title: 'Verify a BIS Licence',
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      onClick: () => toast('Licence verification coming soon', { icon: '🛡️' })
    },
    {
      title: 'Understand ISI/BIS Marks',
      icon: <Award className="w-8 h-8 text-indigo-600" />,
      onClick: () => toast('Information about marks coming soon', { icon: 'ℹ️' })
    },
    {
      title: 'Understand Hallmarking',
      icon: <Diamond className="w-8 h-8 text-purple-600" />,
      onClick: () => navigate('/hallmarking')
    },
    {
      title: 'Verify HUID',
      icon: <Hash className="w-8 h-8 text-pink-600" />,
      onClick: () => navigate('/hallmarking')
    },
    {
      title: 'Find a Standard',
      icon: <FileSearch className="w-8 h-8 text-green-600" />,
      onClick: () => navigate('/standards')
    },
    {
      title: 'Report a Product Issue',
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
      onClick: () => toast('Complaint portal integration coming soon', { icon: '⚠️' })
    },
    {
      title: 'Ask SmartGuide',
      icon: <MessageCircle className="w-8 h-8 text-blue-500" />,
      onClick: () => navigate('/ask')
    }
  ];

  const faqs = [
    {
      question: 'What is the ISI mark?',
      answer: 'The ISI mark is a standards-compliance mark for industrial products in India since 1955. The mark certifies that a product conforms to an Indian standard developed by the Bureau of Indian Standards (BIS), the national standards body of India.'
    },
    {
      question: 'How do I verify if a product has valid BIS certification?',
      answer: 'You can verify a BIS certification by checking the CM/L (Certification Marks Licence) number provided on the product packaging along with the ISI mark. This can be verified on the BIS official website, the BIS Care App, or through our SmartGuide.'
    },
    {
      question: 'What is hallmarking and why is it important?',
      answer: 'Hallmarking is the accurate determination and official recording of the proportionate content of precious metal in precious metal articles. It guarantees purity and protects consumers against victimization due to irregular gold or silver quality.'
    },
    {
      question: 'How can I file a complaint about a substandard product?',
      answer: 'Complaints regarding substandard products with ISI mark or hallmarked jewelry can be registered online through the BIS website, BIS Care App, or by contacting the nearest BIS branch office. Ensure you have purchase details and product information.'
    },
    {
      question: 'What is a QCO (Quality Control Order)?',
      answer: 'A Quality Control Order (QCO) is an order issued by the Government of India that makes it mandatory for certain products to carry the standard mark (ISI) under a BIS licence. Products under QCO cannot be manufactured, imported, distributed, sold, or stored without a valid BIS licence.'
    }
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <PageHeader 
        title="Consumer Help" 
        subtitle="Get help with BIS-related consumer queries and services" 
      />

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((service, idx) => (
            <Card 
              key={idx} 
              className="p-6 flex flex-col items-center text-center cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
              onClick={service.onClick}
            >
              <div className="p-3 bg-gray-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="font-medium text-gray-900">{service.title}</h3>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left font-medium text-gray-900"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                {faq.question}
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white text-gray-600 border-t">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
