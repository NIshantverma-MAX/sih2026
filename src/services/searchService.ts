export type SearchContext = 'hero' | 'global' | 'standards';

export const searchService = {
  search: (query: string, context: SearchContext = 'global'): string => {
    console.log(`[SearchService] Executing search for "${query}" from context: ${context}`);
    if (context === 'hero' || context === 'standards') {
      return `/standards?q=${encodeURIComponent(query)}`;
    }
    return `/search?q=${encodeURIComponent(query)}`;
  }
};
