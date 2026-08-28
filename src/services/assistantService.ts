import type { AssistantMessage, AssistantResponse, Language, StandardRecommendation } from '../types';
import { standards } from '../data/standards';
import { sources } from '../data/sources';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function askQuestion(question: string, language: Language): Promise<AssistantResponse> {
  await delay(2000);
  
  const q = question.toLowerCase();
  let answer = '';
  let matchedStandards: StandardRecommendation[] = [];
  
  if (q.includes('water') || q.includes('bottle') || q.includes('पानी') || q.includes('बोतल')) {
    const relevantStds = standards.filter(s => 
      s.title.toLowerCase().includes('water') || 
      s.title.toLowerCase().includes('steel') ||
      s.category.toLowerCase().includes('household')
    ).slice(0, 3);
    
    matchedStandards = relevantStds.map((s, i) => ({
      standard: s,
      relevanceScore: 95 - (i * 10),
      relevance: (i === 0 ? 'high' : i === 1 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
      matchReasons: ['Product material matches', 'Intended use matches', 'Food contact safety applicable'],
    }));

    answer = language === 'hi' 
      ? 'स्टेनलेस स्टील की पानी की बोतल के लिए निम्नलिखित BIS मानक प्रासंगिक हो सकते हैं:\n\n1. IS 17803:2022 – Stainless Steel Vacuum Insulated Flask\n2. IS 13428:2005 – Stainless Steel Utensils\n\nये मानक खाद्य संपर्क सामग्री, विशिष्ट स्टील ग्रेड और सुरक्षा आवश्यकताओं को कवर करते हैं।'
      : 'For stainless steel water bottles, the following BIS standards may be relevant:\n\n1. IS 17803:2022 – Stainless Steel Vacuum Insulated Flask\n2. IS 13428:2005 – Stainless Steel Utensils\n\nThese standards cover food contact materials, specific steel grades, and safety requirements.';
  } else if (q.includes('led') || q.includes('bulb') || q.includes('एलईडी')) {
    const relevantStds = standards.filter(s => 
      s.title.toLowerCase().includes('led') || 
      s.title.toLowerCase().includes('lamp')
    ).slice(0, 2);
    
    matchedStandards = relevantStds.map((s, i) => ({
      standard: s,
      relevanceScore: 95 - (i * 10),
      relevance: 'high' as const,
      matchReasons: ['Product type matches', 'Electrical safety applicable'],
    }));

    answer = language === 'hi'
      ? 'LED बल्बों के लिए BIS प्रमाणन अनिवार्य है। संबंधित मानक IS 16102 है।'
      : 'BIS certification for LED bulbs is mandatory. The applicable standard is IS 16102 (Self-ballasted LED Lamps).';
  } else if (q.includes('gold') || q.includes('hallmark') || q.includes('सोन') || q.includes('हॉलमार्क')) {
    answer = language === 'hi'
      ? 'सोने के आभूषणों पर हॉलमार्किंग अनिवार्य है। इसमें HUID (6 अंकों का कोड) शामिल होता है जिसे BIS Care ऐप या इस पोर्टल पर सत्यापित किया जा सकता है।'
      : 'Gold hallmarking is mandatory in India. It includes a 6-digit HUID code that can be verified using the BIS Care app or this portal.';
  } else if (q.includes('certification') || q.includes('प्रमाण')) {
    answer = language === 'hi'
      ? 'BIS प्रमाणन प्रक्रिया में सामान्यतः 7 चरण होते हैं: मानक की पहचान, आवश्यकता जाँच, तैयारी, परीक्षण, आवेदन, मूल्यांकन और प्रमाणन।'
      : 'The BIS certification process typically involves 7 steps: Identify Standard, Check Requirement, Prepare, Testing, Application, Assessment, and Certification.';
  } else {
    answer = language === 'hi'
      ? 'BIS मानकों और प्रमाणन के बारे में आपके प्रश्न का उत्तर: कृपया अपने उत्पाद का विवरण दें ताकि हम आपको सही मानक और मार्गदर्शन प्रदान कर सकें।'
      : 'Thank you for your question about BIS standards and certification. Please describe your product in detail so we can provide you with the right standards and guidance.';
  }

  return {
    answer,
    product: q.includes('water') || q.includes('bottle') ? {
      name: 'Stainless Steel Water Bottle',
      category: 'Household / Food Contact Articles',
      confidence: 0.94,
      keywords: ['stainless steel', 'water bottle', 'food contact'],
    } : undefined,
    standards: matchedStandards.length > 0 ? matchedStandards : undefined,
    certification: {
      isMandatory: false,
      scheme: 'ISI Certification Marks Scheme',
      description: 'Product certification under BIS Act 2016',
      timeline: '4-6 months',
    },
    warnings: ['This is AI-generated guidance. Please verify with official BIS sources for the most current information.'],
    sources: sources.slice(0, 3),
  };
}

export async function getConversation(_id: string): Promise<AssistantMessage[]> {
  await delay(500);
  return [];
}
