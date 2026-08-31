import React, { useState } from 'react';
import { CheckCircle, Edit2, AlertCircle, HelpCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProductIdentification } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface Props {
  product: ProductIdentification;
  onUpdate: (updatedProduct: Partial<ProductIdentification>) => void;
}

/**
 * How the query was read: product, category, material, intended use, and how strongly
 * the heuristic matched.
 *
 * The confidence is shown rather than hidden because everything below it — the ranking,
 * the "why relevant" signals — follows from this reading. If the reading is wrong the user
 * needs to see that and correct it, which is what the edit mode is for. It is labelled as
 * this prototype's own interpretation confidence, not a BIS determination.
 */
export const ProductIdentificationCard: React.FC<Props> = ({ product, onUpdate }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: product.name,
    category: product.category,
    material: product.material || '',
    intendedUse: product.intendedUse || ''
  });

  if (product.isAmbiguous) {
    return (
      <Card className="p-5 border-amber-200 bg-amber-50 shadow-sm flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-2">
            {t('standards.productAmbiguousTitle')}
          </h3>
          <p className="text-sm text-amber-800 mb-4">
            <span className="font-medium">&ldquo;{product.name}&rdquo;</span>{' '}
            {t('standards.productAmbiguousDesc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label
                htmlFor="product-type"
                className="block text-xs font-medium text-amber-900 mb-1"
              >
                {t('standards.productTypeQuestion')}
              </label>
              <input
                id="product-type"
                className="w-full text-sm p-2 border border-amber-300 rounded focus:ring-amber-500 focus:border-amber-500 bg-white"
                placeholder={t('standards.productTypePlaceholder')}
                value={editForm.name === product.name ? '' : editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="product-use-material"
                className="block text-xs font-medium text-amber-900 mb-1"
              >
                {t('standards.productUseOrMaterial')}
              </label>
              <input
                id="product-use-material"
                className="w-full text-sm p-2 border border-amber-300 rounded focus:ring-amber-500 focus:border-amber-500 bg-white"
                placeholder={t('standards.productUseOrMaterialPlaceholder')}
                value={editForm.intendedUse}
                onChange={(e) => setEditForm({ ...editForm, intendedUse: e.target.value })}
              />
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              onUpdate({
                name: editForm.name || product.name,
                intendedUse: editForm.intendedUse
              })
            }
          >
            {t('standards.productUpdateSearch')}
          </Button>
        </div>
      </Card>
    );
  }

  const confidencePercent = Math.round(product.confidence * 100);

  /*
    Nothing in the query was recognised, so the heading says exactly that. This branch used
    to fall through to the block below, which put a green tick and "Product identified" above
    a category reading "Not identified" — the one place in this workflow where the interface
    claimed more than the service did. The correction control is kept, because rephrasing is
    the way out of here.
  */
  const identified = product.identified !== false;

  return (
    <Card
      className={
        identified
          ? 'p-4 border-indigo-200 bg-indigo-50 shadow-sm'
          : 'p-4 border-slate-200 bg-slate-50 shadow-sm'
      }
    >
      <div
        className={`flex justify-between items-start mb-3 border-b pb-2 gap-3 ${
          identified ? 'border-indigo-100' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {identified ? (
            <CheckCircle className="w-5 h-5 text-indigo-600" aria-hidden="true" />
          ) : (
            <HelpCircle className="w-5 h-5 text-slate-500" aria-hidden="true" />
          )}
          <h3 className={`font-semibold ${identified ? 'text-indigo-900' : 'text-slate-800'}`}>
            {identified
              ? t('standards.productTitle')
              : t('standards.productNotIdentifiedTitle')}
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className={
            identified
              ? 'h-8 text-indigo-700 bg-white border-indigo-200 flex-shrink-0'
              : 'h-8 text-slate-700 bg-white border-slate-300 flex-shrink-0'
          }
          onClick={() => setIsEditing(!isEditing)}
          aria-expanded={isEditing}
        >
          <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />{' '}
          {isEditing ? t('common.cancel') : t('standards.productEdit')}
        </Button>
      </div>

      {!identified && !isEditing && (
        <p className="text-sm text-slate-600 mb-3">{t('standards.productNotIdentifiedDesc')}</p>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <p className="text-xs text-indigo-700">{t('standards.productEditHint')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="product-name"
                className="block text-xs font-medium text-indigo-900 mb-1"
              >
                {t('standards.productName')}
              </label>
              <input
                id="product-name"
                className="w-full text-sm p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="product-category"
                className="block text-xs font-medium text-indigo-900 mb-1"
              >
                {t('standards.productCategory')}
              </label>
              <input
                id="product-category"
                className="w-full text-sm p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="product-material"
                className="block text-xs font-medium text-indigo-900 mb-1"
              >
                {t('standards.productMaterialOptional')}
              </label>
              <input
                id="product-material"
                className="w-full text-sm p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={editForm.material}
                placeholder={t('standards.productMaterialPlaceholder')}
                onChange={(e) => setEditForm({ ...editForm, material: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="product-use"
                className="block text-xs font-medium text-indigo-900 mb-1"
              >
                {t('standards.productUseOptional')}
              </label>
              <input
                id="product-use"
                className="w-full text-sm p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={editForm.intendedUse}
                placeholder={t('standards.productUsePlaceholder')}
                onChange={(e) => setEditForm({ ...editForm, intendedUse: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onUpdate(editForm);
                setIsEditing(false);
              }}
            >
              {t('standards.productUpdate')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-indigo-900">
          <div>
            <span className="text-indigo-600 text-xs block mb-0.5">
              {t('standards.productName')}
            </span>
            <span className="font-medium">{product.name}</span>
          </div>
          <div>
            <span className="text-indigo-600 text-xs block mb-0.5">
              {t('standards.productCategory')}
            </span>
            <span className="font-medium">{product.category}</span>
          </div>
          {product.material && (
            <div>
              <span className="text-indigo-600 text-xs block mb-0.5">
                {t('standards.productMaterial')}
              </span>
              <span className="font-medium">{product.material}</span>
            </div>
          )}
          {product.intendedUse && (
            <div>
              <span className="text-indigo-600 text-xs block mb-0.5">
                {t('standards.productUse')}
              </span>
              <span className="font-medium">{product.intendedUse}</span>
            </div>
          )}
          {/*
            The reading's own strength. Everything ranked below follows from this, so hiding
            it would leave a low-confidence guess looking as firm as a direct product match.
          */}
          <div>
            <span className="text-indigo-600 text-xs block mb-0.5">
              {t('standards.productMatchStrength')}
            </span>
            <span className="flex items-center gap-2">
              <span className="font-medium tabular-nums">{confidencePercent}%</span>
              <span
                className="h-1.5 w-16 rounded-full bg-indigo-100 overflow-hidden"
                role="img"
                aria-label={`${t('standards.productMatchStrength')}: ${confidencePercent}%`}
              >
                <span
                  className="block h-full rounded-full bg-indigo-500"
                  style={{ width: `${confidencePercent}%` }}
                />
              </span>
            </span>
          </div>
        </div>
      )}

      <p className="text-xs text-indigo-500 mt-4 italic border-t border-indigo-100 pt-2">
        {t('standards.productPrototype')}
      </p>
    </Card>
  );
};
