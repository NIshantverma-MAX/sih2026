import type { UploadedDocument, DocumentAnalysis } from '../types';
import { standards } from '../data/standards';
import { sources } from '../data/sources';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function uploadDocument(file: File): Promise<UploadedDocument> {
  await delay(1000);
  
  return {
    id: Math.random().toString(36).substring(7),
    filename: file.name,
    size: file.size,
    type: file.type,
    uploadDate: new Date().toISOString(),
    status: 'complete',
  };
}

export async function getDocumentResult(documentId: string): Promise<DocumentAnalysis> {
  await delay(1000);
  
  return {
    productIdentified: 'Pressure Cooker (Aluminium)',
    category: 'Household / Kitchen Appliances',
    relevantStandards: [],
    certificationRequirements: [
      'BIS certification under ISI Certification Marks Scheme',
      'Factory inspection and quality assessment',
      'Product testing at BIS-recognized laboratory',
      'Annual surveillance and renewal',
    ],
    testingRequirements: [
      'Chemical composition analysis of stainless steel',
      'Corrosion resistance testing',
      'Food contact safety testing',
      'Dimensional verification',
    ],
    warnings: [
      'This is prototype document analysis. For official guidance, consult BIS directly.',
    ],
    sources: sources.slice(0, 2),
  };
}
