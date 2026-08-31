import React from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/helpers';
import { useTranslation } from '../../hooks/useTranslation';

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  buttonText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  onSearch,
  buttonText,
  size = 'md',
  className
}) => {
  const { t } = useTranslation();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const sizes = {
    sm: "h-9 text-sm",
    md: "h-11 text-base",
    lg: "h-14 text-lg",
  };

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className={cn("text-gray-400", size === 'lg' ? "h-6 w-6" : "h-5 w-5")} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? t('common.searchPlaceholder')}
          className={cn(
            "block w-full rounded-l-lg border-gray-300 pl-11 focus:ring-blue-900 focus:border-blue-900 shadow-sm",
            sizes[size]
          )}
        />
      </div>
      <Button
        onClick={onSearch}
        size={size as any}
        className="rounded-l-none rounded-r-lg whitespace-nowrap shadow-sm"
      >
        {buttonText ?? t('common.search')}
      </Button>
    </div>
  );
};