import React from 'react';
import { Sparkles, ListChecks, Info } from 'lucide-react';

export const ProjectHeader = () => {
  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200">
      <h1 className="text-[15px] font-medium text-gray-900">big_query_project</h1>
      <div className="flex items-center space-x-2">
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Sparkles className="text-gray-600" size={18} />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <ListChecks className="text-gray-600" size={18} />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Info className="text-gray-600" size={18} />
        </button>
        <button className="px-3 py-1.5 bg-[#F9AB00] text-white rounded hover:bg-[#e59e00] transition-colors text-sm font-medium">
          Validate LookML
        </button>
      </div>
    </div>
  );
};