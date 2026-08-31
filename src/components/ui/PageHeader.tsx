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
    <div className="mb-6 flex min-w-0 flex-col justify-between gap-4 sm:mb-8 md:flex-row md:items-start">
      <div className="min-w-0">
        {backTo && (
          <Link 
            to={backTo} 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {backLabel}
          </Link>
        )}
        <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-gray-600 max-w-3xl">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};
