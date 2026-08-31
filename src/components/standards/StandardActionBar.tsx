import React from 'react';
import { ShieldCheck, FlaskConical, MessageSquare, Bookmark, ChevronRight } from 'lucide-react';
import type { Standard } from '../../types';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { useSaveStandard } from '../../hooks/useSaveStandard';
import { cn } from '../../utils/helpers';

export interface StandardActionBarProps {
  standard: Standard;
  /** `/certification?standardId=<id>` */
  onCertification: () => void;
  /** `/labs?standardId=<id>` */
  onFindLabs: () => void;
  /** `/ask` carrying the standard as context. */
  onAsk: () => void;
}

/**
 * What to do next with this standard.
 *
 * Each action hands the standard's id to the page that owns that question — certification
 * scheme guidance, testing laboratories, the assistant — rather than answering it here.
 * That keeps Standards answering "which standard applies?" and nothing else.
 */
export const StandardActionBar: React.FC<StandardActionBarProps> = ({
  standard,
  onCertification,
  onFindLabs,
  onAsk
}) => {
  const { t } = useTranslation();
  const { isSaved, toggleSaved } = useSaveStandard();
  const saved = isSaved(standard.id);

  const actions = [
    {
      key: 'certification',
      icon: ShieldCheck,
      label: t('standards.actions.certification'),
      description: t('standards.actions.certificationDesc'),
      onClick: onCertification,
      accent: 'text-blue-900 bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      key: 'labs',
      icon: FlaskConical,
      label: t('standards.actions.labs'),
      description: t('standards.actions.labsDesc'),
      onClick: onFindLabs,
      accent: 'text-slate-800 bg-white border-slate-200 hover:bg-slate-50'
    },
    {
      key: 'ask',
      icon: MessageSquare,
      label: t('standards.actions.ask'),
      description: t('standards.actions.askDesc'),
      onClick: onAsk,
      accent: 'text-slate-800 bg-white border-slate-200 hover:bg-slate-50'
    }
  ];

  return (
    <Card className="p-5">
      <h2 className="text-sm font-bold text-slate-900 mb-3">{t('standardDetails.nextSteps')}</h2>

      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            className={cn(
              'w-full text-left rounded-lg border p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
              action.accent
            )}
          >
            <div className="flex items-center gap-3">
              <action.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-semibold">{action.label}</span>
                <span className="block text-xs opacity-80">{action.description}</span>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-60" aria-hidden="true" />
            </div>
          </button>
        ))}

        <button
          type="button"
          onClick={() => toggleSaved(standard)}
          aria-pressed={saved}
          aria-label={t('standards.save.aria')}
          className={cn(
            'w-full text-left rounded-lg border p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
            saved
              ? 'text-amber-900 bg-amber-50 border-amber-200 hover:bg-amber-100'
              : 'text-slate-800 bg-white border-slate-200 hover:bg-slate-50'
          )}
        >
          <div className="flex items-center gap-3">
            <Bookmark
              className={cn('w-5 h-5 flex-shrink-0', saved && 'fill-current')}
              aria-hidden="true"
            />
            <span className="text-sm font-semibold">
              {saved ? t('standards.save.saved') : t('standardDetails.saveStandard')}
            </span>
          </div>
        </button>
      </div>
    </Card>
  );
};
