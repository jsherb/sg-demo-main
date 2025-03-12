import React from 'react';
import { Menu, HelpCircle, User } from 'lucide-react';
import { LOOKER_LOGO } from '../base64/images';

export const TopNav = () => {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Menu className="text-gray-600" size={20} />
        </button>
        <img src={LOOKER_LOGO} alt="Looker" className="h-10" />
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <HelpCircle className="text-gray-600" size={20} />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <User className="text-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
};