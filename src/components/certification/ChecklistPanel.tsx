import React from 'react';
import { ListChecks } from 'lucide-react';
import { Card } from '../ui/Card';
import { CertificationJourneyStage } from '../../types';
import { cn } from '../../utils/helpers';

export interface ChecklistPanelProps {
  stage: CertificationJourneyStage;
  checkedItems: string[];
  onToggle: (itemId: string) => void;
}

/** Stable id for a checklist item so ticks survive re-renders and stage switches. */
export function checklistItemId(stageKey: string, index: number): string {
  return `${stageKey}:${index}`;
}

/**
 * The checklist for the current step only. It is scoped to the step deliberately — a
 * single flat list of forty items is what makes BIS guidance feel impossible to start.
 */
export const ChecklistPanel: React.FC<ChecklistPanelProps> = ({ stage, checkedItems, onToggle }) => {
  if (stage.checklist.length === 0) return null;

  const doneCount = stage.checklist.filter((_, i) => checkedItems.includes(checklistItemId(stage.key, i))).length;

  return (
    <Card className="p-5">
      <div className="mb-1 flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-blue-900" />
        <h3 className="text-sm font-bold text-gray-900">Checklist for this step</h3>
      </div>
      <p className="mb-3 text-xs text-gray-500">
        {doneCount} of {stage.checklist.length} done · {stage.title}
      </p>

      <ul className="space-y-2">
        {stage.checklist.map((item, index) => {
          const id = checklistItemId(stage.key, index);
          const checked = checkedItems.includes(id);
          return (
            <li key={id}>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-1 py-1 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(id)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                />
                <span className={cn('text-sm leading-relaxed', checked ? 'text-gray-400 line-through' : 'text-gray-700')}>
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};
