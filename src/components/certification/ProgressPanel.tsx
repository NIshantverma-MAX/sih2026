import React from 'react';
import { Check, Circle, Dot } from 'lucide-react';
import { Card } from '../ui/Card';
import { CertificationJourneyStage } from '../../types';
import { cn } from '../../utils/helpers';

export interface ProgressPanelProps {
  stages: CertificationJourneyStage[];
  activeIndex: number;
  completed: string[];
  onSelect: (index: number) => void;
}

/**
 * Answers the three orientation questions on every screen: where am I, what have I
 * finished, and what comes next.
 */
export const ProgressPanel: React.FC<ProgressPanelProps> = ({ stages, activeIndex, completed, onSelect }) => {
  const doneCount = stages.filter((s) => completed.includes(s.key)).length;
  const percent = stages.length === 0 ? 0 : Math.round((doneCount / stages.length) * 100);
  const nextStage = stages.find((s, i) => i > activeIndex && !completed.includes(s.key)) ?? stages[activeIndex + 1];

  return (
    <Card className="p-5">
      <h3 className="text-sm font-bold text-gray-900">Your progress</h3>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-blue-900 transition-all" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-xs font-semibold text-gray-600">
          {doneCount}/{stages.length}
        </span>
      </div>

      <ol className="mt-4 space-y-1">
        {stages.map((stage, index) => {
          const isDone = completed.includes(stage.key);
          const isActive = index === activeIndex;
          return (
            <li key={stage.key}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors',
                  isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                )}
              >
                {isDone ? (
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                ) : isActive ? (
                  <Dot className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-900" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300" />
                )}
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block text-sm leading-tight',
                      isActive ? 'font-bold text-blue-900' : isDone ? 'font-medium text-gray-900' : 'text-gray-600'
                    )}
                  >
                    {stage.step}. {stage.title}
                  </span>
                  {isActive && <span className="mt-0.5 block text-xs text-blue-800">You are here</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {nextStage && (
        <p className="mt-4 border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-600">
          <span className="font-semibold text-gray-900">Up next: </span>
          {nextStage.title} — {nextStage.plainQuestion}
        </p>
      )}
    </Card>
  );
};
