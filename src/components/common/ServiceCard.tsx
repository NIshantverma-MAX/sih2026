import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/helpers';

export interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  color?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  color = "bg-blue-100 text-blue-900"
}) => {
  return (
    <Card hoverable className="p-6 h-full flex flex-col group cursor-pointer" onClick={onClick}>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 flex-1 mb-4">{description}</p>
      <div className="flex items-center text-sm font-semibold text-blue-900">
        Explore <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
};