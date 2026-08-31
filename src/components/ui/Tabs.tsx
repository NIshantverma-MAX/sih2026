import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/helpers';
import { useTranslation } from '../../hooks/useTranslation';

export interface Tab {
  id: string;
  label: string;
  content?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, activeTab: controlledTab, onChange, className }) => {
  const { t } = useTranslation();
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabChange = (id: string) => {
    if (controlledTab === undefined) {
      setInternalTab(id);
    }
    if (onChange) {
      onChange(id);
    }
  };

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label={t('a11y.tabs')}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
};