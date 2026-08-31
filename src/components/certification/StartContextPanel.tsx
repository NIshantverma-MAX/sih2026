import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, FileText, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StandardRecommendation } from '../../types';
import { GlossaryChip } from './GlossaryChip';
import { useTranslation } from '../../hooks/useTranslation';

export interface StartContextPanelProps {
  /** Product the user described, when we have one but still no standard. */
  productName?: string;
  suggestedStandards?: StandardRecommendation[];
  /** Local-only submit; this panel never touches shared search state. */
  onDescribeProduct: (product: string) => void;
}

/**
 * Shown when we have no standard context. Rather than inventing a product and printing
 * certification steps for it, the page asks for the one thing it needs to be useful.
 */
export const StartContextPanel: React.FC<StartContextPanelProps> = ({
  productName,
  suggestedStandards,
  onDescribeProduct
}) => {
  const [productQuery, setProductQuery] = useState(productName ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = productQuery.trim();
    if (trimmed) onDescribeProduct(trimmed);
  };

  const hasSuggestions = Boolean(suggestedStandards && suggestedStandards.length > 0);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex gap-4">
          <Compass className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-900" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900">Select or describe your product to begin.</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Certification requirements are decided by the Indian Standard that covers your product — which tests you
              need, whether a <GlossaryChip termKey="qco" /> makes it compulsory, which scheme applies, and what BIS
              will check. Until we know your standard we would only be showing you generic information, so tell us what
              you make.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Input
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="e.g. stainless steel water bottle, LED bulb, pressure cooker"
                className="flex-1"
                aria-label="Describe your product"
              />
              <Button type="submit" variant="primary" icon={Search} disabled={!productQuery.trim()}>
                Find applicable standard
              </Button>
            </form>

            <p className="mt-3 text-xs text-gray-500">
              Already know your standard? Browse{' '}
              <Link to="/standards" className="font-medium text-blue-900 hover:underline">
                Standards
              </Link>{' '}
              and open{' '}
              <span className="font-medium text-gray-700">Get certification guidance</span> from the standard&apos;s page.
            </p>
          </div>
        </div>
      </Card>

      {hasSuggestions && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-gray-900">
            Standards that may cover {productName ? `"${productName}"` : 'your product'}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Pick the one whose scope matches your product. Certification guidance below will then be built for it.
          </p>

          <ul className="mt-4 space-y-3">
            {suggestedStandards!.map(({ standard, relevance }) => (
              <li key={standard.id}>
                <Link
                  to={`/certification?standardId=${standard.id}&product=${encodeURIComponent(standard.title)}`}
                  className="group flex items-start gap-3 rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50"
                >
                  <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-900" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-blue-900">
                        {standard.standardNumber}
                      </span>
                      <Badge variant={relevance === 'high' ? 'success' : relevance === 'medium' ? 'info' : 'default'}>
                        {relevance} match
                      </Badge>
                      <Badge variant={standard.certificationStatus === 'mandatory' ? 'error' : 'default'}>
                        {standard.certificationStatus}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{standard.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{standard.scope}</p>
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300 group-hover:text-blue-900" />
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to={`/standards?q=${encodeURIComponent(productName ?? '')}`}
            className="mt-4 inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            See all matching standards
          </Link>
        </Card>
      )}
    </div>
  );
};
