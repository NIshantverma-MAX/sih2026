import type { Standard, SearchFilters, StandardRecommendation, ProductIdentification } from '../types';
import { standards } from '../data/standards';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function searchStandards(query: string, filters?: SearchFilters): Promise<StandardRecommendation[]> {
  await delay(800);
  const lowercaseQuery = query.toLowerCase();
  
  // Direct IS number lookup intent
  const isDirectLookup = /is\s*\d+/i.test(query);

  let results = standards;
  if (query) {
    results = standards.filter(
      (s) =>
        s.title.toLowerCase().includes(lowercaseQuery) ||
        s.standardNumber.toLowerCase().includes(lowercaseQuery) ||
        s.description.toLowerCase().includes(lowercaseQuery) ||
        s.category.toLowerCase().includes(lowercaseQuery) ||
        s.sector.toLowerCase().includes(lowercaseQuery) ||
        s.scope.toLowerCase().includes(lowercaseQuery) ||
        s.keyRequirements?.some(req => req.toLowerCase().includes(lowercaseQuery))
    );
  }
  
  if (filters) {
    if (filters.category) {
      results = results.filter((s) => s.category === filters.category);
    }
    if (filters.status) {
      results = results.filter((s) => s.status === filters.status);
    }
    if (filters.certificationStatus) {
      results = results.filter((s) => s.certificationStatus === filters.certificationStatus);
    }
    if (filters.sector) {
      results = results.filter((s) => s.sector === filters.sector);
    }
  }

  return results.map((s, index) => {
    let relevance: 'high' | 'medium' | 'low' = 'low';
    let matchScore = 0;
    const matchReasons: string[] = [];
    let matchType: 'primary' | 'alternative' | 'related' = 'alternative';
    const evidenceIds: string[] = [];
    
    if (query) {
      if (s.standardNumber.toLowerCase().includes(lowercaseQuery) || isDirectLookup) {
        matchScore += 8;
        matchReasons.push(`Direct Standard Number Match`);
        matchType = 'primary';
      } else {
        if (s.title.toLowerCase().includes(lowercaseQuery)) {
          matchScore += 5;
          matchReasons.push('Product material matches');
        }
        if (s.description.toLowerCase().includes(lowercaseQuery)) {
          matchScore += 3;
          matchReasons.push('Intended use matches');
        }
        if (s.category.toLowerCase().includes(lowercaseQuery)) {
          matchScore += 2;
          matchReasons.push('Relevant product category');
        }
        if (s.scope.toLowerCase().includes(lowercaseQuery)) {
          matchScore += 4;
          matchReasons.push('Standard scope covers this product');
          evidenceIds.push('src-1');
        }
      }
      
      if (matchScore > 5) {
        relevance = 'high';
        if (index === 0) matchType = 'primary';
      }
      else if (matchScore > 2) {
        relevance = 'medium';
      }
    } else {
      relevance = 'high';
      matchReasons.push('General match');
      matchType = index === 0 ? 'primary' : 'alternative';
    }

    if (matchReasons.length === 0) {
      matchReasons.push('Partial match in description or category');
    }

    const relevanceScore = relevance === 'high' ? 85 + Math.floor(Math.random() * 15) : 
                          relevance === 'medium' ? 60 + Math.floor(Math.random() * 25) : 
                          30 + Math.floor(Math.random() * 30);

    return {
      standard: s,
      relevanceScore,
      relevance,
      matchType,
      matchReasons,
      evidenceIds: evidenceIds.length > 0 ? evidenceIds : undefined
    };
  }).sort((a, b) => {
    if (a.matchType === 'primary' && b.matchType !== 'primary') return -1;
    if (b.matchType === 'primary' && a.matchType !== 'primary') return 1;
    return b.relevanceScore - a.relevanceScore;
  });
}

export async function getStandard(id: string): Promise<Standard | undefined> {
  await delay(500);
  return standards.find((s) => s.id === id);
}

export async function getRelatedStandards(id: string): Promise<Standard[]> {
  await delay(600);
  const current = standards.find(s => s.id === id);
  if (!current) return [];
  return standards.filter(s => 
    s.id !== id && (
      s.category === current.category || 
      current.relatedStandardIds.includes(s.id)
    )
  ).slice(0, 3);
}

export async function getLatestVersion(id: string): Promise<Standard | null> {
  await delay(300);
  const current = standards.find(s => s.id === id);
  if (current && current.status === 'under-revision') {
    // Mock returning a new version if under revision
    return { ...current, status: 'active', year: current.year + 2, id: current.id + '-v2' } as Standard;
  }
  return null;
}

export async function identifyProduct(query: string): Promise<ProductIdentification> {
  await delay(1000);
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery === 'machine' || lowercaseQuery === 'machines') {
    return {
      name: query,
      category: 'Unknown',
      confidence: 0.1,
      keywords: [],
      isAmbiguous: true
    };
  }

  let name = query;
  let category = 'General Products';
  let material = undefined;
  let intendedUse = undefined;
  const keywords: string[] = [];
  let confidence = 0.85;

  if (lowercaseQuery.includes('water') && lowercaseQuery.includes('bottle')) {
    name = 'Stainless Steel Water Bottle';
    category = 'Household / Food Contact Articles';
    material = 'Stainless Steel';
    intendedUse = 'Drinking / Storage';
    keywords.push('stainless steel', 'water bottle', 'food contact', 'beverage container');
    confidence = 0.94;
  } else if (lowercaseQuery.includes('steel') && (lowercaseQuery.includes('bottle') || lowercaseQuery.includes('flask'))) {
    name = 'Stainless Steel Water Bottle';
    category = 'Household / Food Contact Articles';
    material = 'Stainless Steel';
    intendedUse = 'Drinking / Storage';
    keywords.push('stainless steel', 'flask', 'food contact');
    confidence = 0.92;
  } else if (lowercaseQuery.includes('led') && lowercaseQuery.includes('bulb')) {
    name = 'LED Bulb';
    category = 'Electrical / Lighting';
    intendedUse = 'General Lighting';
    keywords.push('LED', 'bulb', 'lighting', 'electrical');
    confidence = 0.96;
  } else if (lowercaseQuery.includes('pressure') && lowercaseQuery.includes('cooker')) {
    name = 'Pressure Cooker';
    category = 'Household / Kitchen Appliances';
    intendedUse = 'Cooking';
    keywords.push('pressure cooker', 'kitchen', 'cooking');
    confidence = 0.95;
  } else if (lowercaseQuery.includes('gold') || lowercaseQuery.includes('jewellery') || lowercaseQuery.includes('jewelry')) {
    name = 'Gold Jewellery';
    category = 'Precious Metals / Jewellery';
    material = 'Gold';
    keywords.push('gold', 'jewellery', 'hallmarking');
    confidence = 0.93;
  } else if (lowercaseQuery.includes('electrical') || lowercaseQuery.includes('switch')) {
    name = 'Electrical Switch';
    category = 'Electrical / Switches';
    intendedUse = 'Household electrical';
    keywords.push('electrical', 'switch', 'wiring');
    confidence = 0.91;
  } else if (lowercaseQuery.includes('water') && lowercaseQuery.includes('purifier')) {
    name = 'Water Purifier';
    category = 'Water Treatment / Household';
    intendedUse = 'Drinking water filtration';
    keywords.push('water purifier', 'drinking water', 'filtration');
    confidence = 0.94;
  } else if (lowercaseQuery.includes('helmet')) {
    name = 'Safety Helmet';
    category = 'Safety / Personal Protective Equipment';
    intendedUse = 'Head protection';
    keywords.push('helmet', 'safety', 'protective');
    confidence = 0.93;
  } else if (lowercaseQuery.includes('cement')) {
    name = 'Cement';
    category = 'Construction / Building Materials';
    intendedUse = 'Building/Construction';
    keywords.push('cement', 'construction', 'building');
    confidence = 0.95;
  } else {
    // Generic fallback
    const words = query.split(/\s+/).filter(w => w.length > 3);
    keywords.push(...words.slice(0, 4));
    confidence = 0.75;
  }

  return {
    name,
    category,
    material,
    intendedUse,
    confidence,
    keywords,
    isAmbiguous: false
  };
}
