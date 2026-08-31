import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { PageHeader, Tabs, EmptyState } from '../components/ui';
import { Bookmark, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SavedItems() {
  const { savedItems, removeSavedItem } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSavedItem(id);
    toast.success('Item removed from saved list');
  };

  const handleNavigate = (type: string, id: string) => {
    switch (type) {
      // Each saved item carries the id of the thing it points at, so it opens that thing
      // rather than the list it came from. `laboratory` previously navigated to
      // `/laboratories`, which is not a route and landed on the not-found page.
      case 'standard': navigate(`/standards/${id}`); break;
      case 'laboratory': navigate(`/labs/${id}`); break;
      case 'query': navigate(`/my-queries`); break;
      default: break;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'standard', label: 'Standards' },
    { id: 'laboratory', label: 'Laboratories' },
    { id: 'query', label: 'Queries' },
    { id: 'guide', label: 'Guides' }
  ];

  const filteredItems = activeTab === 'all' 
    ? savedItems 
    : savedItems.filter(item => item.type === activeTab);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Saved Items" 
        subtitle="Your bookmarked standards, laboratories, and queries" 
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleNavigate(item.type, item.itemId)}
              className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-full uppercase tracking-wider">
                  {item.type}
                </span>
                <button 
                  onClick={(e) => handleRemove(item.id, e)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove saved item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm text-gray-600 flex-1">{item.subtitle}</p>
              )}
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Saved on {new Date(item.savedDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Bookmark}
          title="No saved items yet"
          description="Bookmark standards, labs, or queries to see them here."
        />
      )}
    </div>
  );
}
