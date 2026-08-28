import React from 'react';
import { MapPin, Phone, Mail, Award, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Laboratory } from '../../types';

export interface LaboratoryCardProps {
  lab: Laboratory;
  onViewDetails?: () => void;
}

export const LaboratoryCard: React.FC<LaboratoryCardProps> = ({ lab, onViewDetails }) => {
  return (
    <Card className="p-5 hoverable h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex-1 pr-2">{lab.name}</h3>
        {lab.recognized && (
          <Badge variant="success" className="flex-shrink-0">
            <Award className="w-3 h-3 mr-1" />
            BIS Recognized
          </Badge>
        )}
      </div>
      
      <div className="space-y-2 mt-2 flex-1">
        <div className="flex items-start text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
          <span>{lab.address}</span>
        </div>
        {lab.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{lab.phone}</span>
          </div>
        )}
        {lab.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{lab.email}</span>
          </div>
        )}
      </div>
      
      {lab.supportedStandards && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Supports {lab.supportedStandards.length} standards
          </span>
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={onViewDetails} className="text-blue-900">
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};