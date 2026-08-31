import React from 'react';
import { cn } from '../../utils/helpers';
import { Card } from './Card';
import { useTranslation } from '../../hooks/useTranslation';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  emptyMessage,
  className
}: DataTableProps<T>) {
  const { t } = useTranslation();
  if (!data.length) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
        {emptyMessage ?? t('common.noData')}
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr 
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "transition-colors",
                onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
              )}
            >
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}