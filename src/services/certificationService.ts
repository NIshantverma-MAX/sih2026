import { CertificationGuide } from '../types';
import { certificationGuides } from '../data/certifications';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCertificationGuide(standardId: string): Promise<CertificationGuide | undefined> {
  await delay(800);
  return certificationGuides.find(c => c.standardId === standardId);
}

export async function getCertificationRequirements(standardId: string): Promise<string[]> {
  await delay(600);
  const guide = certificationGuides.find(c => c.standardId === standardId);
  return guide ? guide.steps.map(s => s.title) : [
    'Submit application form',
    'Pay required fees',
    'Factory inspection',
    'Sample testing in BIS recognized lab',
    'Grant of license'
  ];
}

export async function getQCOStatus(productCategory: string): Promise<{mandatory: boolean; qcoNumber?: string; effectiveDate?: string}> {
  await delay(500);
  const lowercaseCategory = productCategory.toLowerCase();
  
  if (lowercaseCategory.includes('toy') || lowercaseCategory.includes('electronics') || lowercaseCategory.includes('gold')) {
    return {
      mandatory: true,
      qcoNumber: 'QCO-' + Math.floor(Math.random() * 10000),
      effectiveDate: '2023-01-01'
    };
  }
  
  return {
    mandatory: false
  };
}
