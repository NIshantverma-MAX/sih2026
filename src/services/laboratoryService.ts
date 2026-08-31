import type { Laboratory, LabFilters } from '../types';
import { laboratories } from '../data/laboratories';
import { standards } from '../data/standards';

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

export interface LabStandardOption {
  /** Standard id, matching what `supportedStandards` holds. */
  value: string;
  /** The IS number, so the option reads the way the user knows the standard. */
  label: string;
  labCount: number;
}

/**
 * Standards that at least one laboratory in this dataset covers.
 *
 * Tallied from `supportedStandards` and joined to the standards dataset for the label, so
 * the filter can only offer a standard that some lab actually tests to. The dropdown
 * previously listed IS numbers as its values while the data holds standard ids, so every
 * selection matched nothing.
 */
export function getLabStandardOptions(): LabStandardOption[] {
  const counts = new Map<string, number>();
  for (const lab of laboratories) {
    for (const standardId of lab.supportedStandards) {
      counts.set(standardId, (counts.get(standardId) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([value, labCount]) => {
      const standard = standards.find(s => s.id === value);
      return {
        value,
        label: standard ? standard.standardNumber : value,
        labCount
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}
