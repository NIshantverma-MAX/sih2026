export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getRelevanceColor(relevance: 'high' | 'medium' | 'low'): string {
  switch (relevance) {
    case 'high': return 'text-green-600 bg-green-50 border-green-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'valid' || s === 'mandatory') {
    return 'text-green-700 bg-green-50 border-green-200';
  }
  if (s === 'withdrawn' || s === 'invalid') {
    return 'text-red-700 bg-red-50 border-red-200';
  }
  if (s === 'under review' || s === 'voluntary') {
    return 'text-blue-700 bg-blue-50 border-blue-200';
  }
  return 'text-gray-700 bg-gray-50 border-gray-200';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
