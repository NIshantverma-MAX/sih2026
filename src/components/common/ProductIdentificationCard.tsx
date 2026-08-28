import React, { useState } from 'react';
import { CheckCircle, Edit2, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProductIdentification } from '../../types';

interface Props {
  product: ProductIdentification;
  onUpdate: (updatedProduct: Partial<ProductIdentification>) => void;
}

export const ProductIdentificationCard: React.FC<Props> = ({ product, onUpdate }) => {
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
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-2">More information is needed</h3>
          <p className="text-sm text-amber-800 mb-4">
            Your search "{product.name}" is too broad to identify specific Indian Standards accurately. Please provide more details.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-amber-900 mb-1">What type of product?</label>
              <input 
                className="w-full text-sm p-2 border border-amber-300 rounded focus:ring-amber-500 focus:border-amber-500 bg-white" 
                placeholder="e.g. Injection moulding machine"
                value={editForm.name === product.name ? '' : editForm.name}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-900 mb-1">Intended use / Material</label>
              <input 
                className="w-full text-sm p-2 border border-amber-300 rounded focus:ring-amber-500 focus:border-amber-500 bg-white" 
                placeholder="e.g. Industrial / Steel"
                value={editForm.intendedUse}
                onChange={e => setEditForm({...editForm, intendedUse: e.target.value})}
              />
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => onUpdate({ name: editForm.name || product.name, intendedUse: editForm.intendedUse })}>
            Update Search
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-indigo-200 bg-indigo-50 shadow-sm">
      <div className="flex justify-between items-start mb-3 border-b border-indigo-100 pb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">AI Product Interpretation</h3>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-indigo-700 bg-white border-indigo-200" onClick={() => setIsEditing(!isEditing)}>
          <Edit2 className="w-3.5 h-3.5 mr-1" /> {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-indigo-900 mb-1">Product</label>
              <input 
                className="w-full text-sm p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                value={editForm.name}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-900 mb-1">Category</label>
              <input 
                className="w-full text-sm p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                value={editForm.category}
                onChange={e => setEditForm({...editForm, category: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-900 mb-1">Material (Optional)</label>
              <input 
                className="w-full text-sm p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                value={editForm.material}
                placeholder="e.g. Stainless Steel"
                onChange={e => setEditForm({...editForm, material: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-900 mb-1">Intended Use (Optional)</label>
              <input 
                className="w-full text-sm p-2 border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                value={editForm.intendedUse}
                placeholder="e.g. Drinking"
                onChange={e => setEditForm({...editForm, intendedUse: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={() => {
              onUpdate(editForm);
              setIsEditing(false);
            }}>
              Update Recommendations
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-indigo-900">
          <div><span className="text-indigo-600 text-xs block mb-0.5">Product</span><span className="font-medium">{product.name}</span></div>
          <div><span className="text-indigo-600 text-xs block mb-0.5">Category</span><span className="font-medium">{product.category}</span></div>
          {product.material && (
            <div><span className="text-indigo-600 text-xs block mb-0.5">Material</span><span className="font-medium">{product.material}</span></div>
          )}
          {product.intendedUse && (
            <div><span className="text-indigo-600 text-xs block mb-0.5">Intended Use</span><span className="font-medium">{product.intendedUse}</span></div>
          )}
        </div>
      )}
      
      <p className="text-xs text-indigo-500 mt-4 italic border-t border-indigo-100 pt-2">
        Prototype analysis based on your query. Verify against official BIS sources.
      </p>
    </Card>
  );
};
