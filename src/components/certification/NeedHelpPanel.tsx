import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircleQuestion, FlaskConical, Phone } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';

export interface NeedHelpPanelProps {
  /** Seeds the assistant / lab search with the user's context. */
  contextQuery?: string;
}

export const NeedHelpPanel: React.FC<NeedHelpPanelProps> = ({ contextQuery }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const suffix = contextQuery ? `?q=${encodeURIComponent(contextQuery)}` : '';

  return (
    <Card className="p-5">
      <div className="mb-1 flex items-center gap-2">
        <MessageCircleQuestion className="h-4 w-4 text-blue-900" />
        <h3 className="text-sm font-bold text-gray-900">{t('certification.help.title')}</h3>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-gray-600">
        {t('certification.help.desc')}
      </p>

      <div className="space-y-2">
        <Button variant="primary" size="sm" className="w-full" onClick={() => navigate(`/ask${suffix}`)}>
          {t('certification.help.askAssistant')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          icon={FlaskConical}
          onClick={() => navigate('/labs')}
        >
          {t('certification.help.findLabs')}
        </Button>
        <a
          href="https://www.bis.gov.in/contact-us/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Phone className="h-4 w-4" />
          {t('certification.help.contactBis')}
        </a>
      </div>
    </Card>
  );
};
