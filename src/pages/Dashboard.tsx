import React from 'react';
import { useStore } from '../lib/store';
import { PageHeader, Card, Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { FileSearch, MessageSquare, Upload, Bookmark } from 'lucide-react';

export default function Dashboard() {
  const { user, savedItems } = useStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your BIS SmartGuide activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Queries</p>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-700 rounded-full">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Saved Items</p>
            <h3 className="text-2xl font-bold text-gray-900">{savedItems.length}</h3>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Documents</p>
            <h3 className="text-2xl font-bold text-gray-900">3</h3>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-full">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Actions</p>
            <h3 className="text-2xl font-bold text-gray-900">1</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y">
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <p className="text-sm font-medium text-gray-900">Searched for standard "IS 14543"</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <p className="text-sm font-medium text-gray-900">Uploaded document "Technical_Spec_v2.pdf"</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <p className="text-sm font-medium text-gray-900">Asked about "Gold Hallmarking requirements"</p>
                <p className="text-xs text-gray-500 mt-1">Oct 12, 2023</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid gap-4">
            <Button 
              variant="outline" 
              className="w-full justify-start h-14" 
              onClick={() => navigate('/ask')}
            >
              <MessageSquare className="w-5 h-5 mr-3 text-blue-600" />
              Ask a Question
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-14"
              onClick={() => navigate('/standards')}
            >
              <FileSearch className="w-5 h-5 mr-3 text-green-600" />
              Search Standards
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-14"
              onClick={() => navigate('/upload-document')}
            >
              <Upload className="w-5 h-5 mr-3 text-purple-600" />
              Upload Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
