import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Query } from '../../types';
import { formatDate, truncateText, getStatusColor } from '../../utils/helpers';

export interface QueryCardProps {
  query: Query;
  onClick?: () => void;
}

export const QueryCard: React.FC<QueryCardProps> = ({ query, onClick }) => {
  const statusColor = getStatusColor(query.status);
  
  return (
    <Card hoverable className="p-4 cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="bg-gray-100 p-2 rounded-lg text-gray-500 mt-1">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
            {truncateText(query.question, 100)}
          </h4>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(query.date)}
            </div>
            <Badge variant={statusColor as any}>{query.status}</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};