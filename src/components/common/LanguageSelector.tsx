import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { cn } from '../../utils/helpers';

const languages = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' }
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        aria-label="Change language"
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md bg-white px-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:min-w-0 sm:px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4 text-gray-500 sm:mr-2" />
        <span className="hidden sm:inline-block">{currentLang.nativeLabel}</span>
        <ChevronDown className="hidden h-4 w-4 text-gray-500 sm:ml-1 sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 max-w-[calc(100vw-1rem)] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code as any}
                onClick={() => {
                  setLanguage(lang.code as any);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-2 text-sm",
                  language === lang.code as any ? "text-blue-900 bg-blue-50" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span>{lang.nativeLabel}</span>
                {language === lang.code as any && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
