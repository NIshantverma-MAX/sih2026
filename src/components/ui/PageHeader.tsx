import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backTo,
  backLabel = "Back",
  actions
}) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        {backTo && (
          <Link 
            to={backTo} 
            className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {backLabel}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-gray-600 dark:text-slate-400 max-w-3xl">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex flex-shrink-0 items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};