import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/helpers';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  onAction,
  className
}) => {
  return (
    <div className={cn("text-center py-12 px-4 sm:px-6 lg:px-8", className)}>
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} variant="outline">
            {action}
          </Button>
        </div>
      )}
    </div>
  );
};