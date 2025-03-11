import React from 'react';
import { Pencil, Compass, Search, SlidersHorizontal, Table2 } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="w-[72px] bg-white border-r border-gray-200 flex flex-col">
      <div className="py-2 flex flex-col items-center">
        <button className="w-12 h-12 flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] rounded-lg mb-1">
          <Pencil size={20} strokeWidth={1.5} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] rounded-lg mb-1">
          <Compass size={20} strokeWidth={1.5} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] rounded-lg mb-1">
          <Search size={20} strokeWidth={1.5} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] rounded-lg">
          <SlidersHorizontal size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};