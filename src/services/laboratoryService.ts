import type { Laboratory, LabFilters } from '../types';
import { laboratories } from '../data/laboratories';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function searchLaboratories(filters?: LabFilters): Promise<Laboratory[]> {
  await delay(1000);
  
  let results = [...laboratories];
  
  if (filters) {
    if (filters.state) {
      results = results.filter(l => l.state.toLowerCase() === filters.state?.toLowerCase());
    }
    if (filters.city) {
      results = results.filter(l => l.city.toLowerCase() === filters.city?.toLowerCase());
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.city.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q)
      );
    }
    if (filters.standard) {
      results = results.filter(l => l.supportedStandards.some(s => s.includes(filters.standard!)));
    }
  }
  
  return results;
}

export async function getLaboratory(id: string): Promise<Laboratory | undefined> {
  await delay(500);
  return laboratories.find(l => l.id === id);
}
