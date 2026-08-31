import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex text-sm text-gray-500 font-medium mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link to={item.href} className="hover:text-blue-900 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-gray-900" : ""}>{item.label}</span>
              )}
              {!isLast && <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};