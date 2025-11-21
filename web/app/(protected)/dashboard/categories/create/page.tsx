'use client';

import { FolderPlus } from 'lucide-react';

export default function CreateCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <FolderPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Category</h1>
            <p className="text-gray-600">Add a new category to organize content</p>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-500">Category creation form coming soon...</p>
        </div>
      </div>
    </div>
  );
}
