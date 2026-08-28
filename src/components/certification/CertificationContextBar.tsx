import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, FileText, Search, RefreshCw, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CertificationContext, ManufacturingLocation } from '../../types';

export interface CertificationContextBarProps {
  context: CertificationContext;
  location: ManufacturingLocation;
  onLocationChange: (location: ManufacturingLocation) => void;
  onChangeProduct: () => void;
}

/**
 * Shows what the page is reasoning about — the product, the standard and where that
 * context came from — so the user never has to guess whose product this guidance is for.
 */
export const CertificationContextBar: React.FC<CertificationContextBarProps> = ({
  context,
  location,
  onLocationChange,
  onChangeProduct
}) => {
  const { standard, productName, productCategory, origin } = context;
  const navigate = useNavigate();

  const originLabel =
    origin === 'standard'
      ? 'Carried over from the standard you were viewing'
      : origin === 'product'
        ? 'Matched from the product you described'
        : 'No product context yet';

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900">Your product context</h2>
        <Badge variant="info">{originLabel}</Badge>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex gap-3">
          <Package className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Product</dt>
            <dd className="text-sm font-medium text-gray-900">{productName || 'Not specified'}</dd>
            {productCategory && <dd className="mt-0.5 text-xs text-gray-500">{productCategory}</dd>}
          </div>
        </div>

        <div className="flex gap-3">
          <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Applicable standard</dt>
            {standard ? (
              <>
                <dd className="text-sm font-medium text-gray-900">
                  <Link to={`/standards/${standard.id}`} className="hover:text-blue-900 hover:underline">
                    {standard.standardNumber}
                  </Link>
                </dd>
                <dd className="mt-0.5 text-xs text-gray-500">{standard.title}</dd>
              </>
            ) : (
              <dd className="text-sm font-medium text-amber-700">Not identified yet</dd>
            )}
          </div>
        </div>
      </dl>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Where is your manufacturing unit?
            </p>
            <p className="mb-2 text-xs text-gray-500">
              A factory outside India applies through a different BIS scheme, so this changes the guidance below.
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: 'india' as ManufacturingLocation, label: 'In India' },
                  { value: 'outside-india' as ManufacturingLocation, label: 'Outside India' }
                ]
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onLocationChange(option.value)}
                  aria-pressed={location === option.value}
                  className={
                    location === option.value
                      ? 'rounded-lg border border-blue-900 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-900'
                      : 'rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
        <Button variant="outline" size="sm" icon={RefreshCw} onClick={onChangeProduct}>
          Change product
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={Search}
          onClick={() =>
            navigate(standard ? `/standards?q=${encodeURIComponent(standard.category)}` : '/standards')
          }
        >
          {standard ? 'Change standard' : 'Find applicable standard'}
        </Button>
      </div>
    </Card>
  );
};
