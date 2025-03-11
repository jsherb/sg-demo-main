import React from 'react';
import { Menu, HelpCircle, User } from 'lucide-react';

export const Header = () => {
  return (
    <div className="bg-[#1A73E8] text-white h-8 flex items-center px-4 text-sm">
      <span>You are in Development Mode.</span>
      <span className="ml-auto">Exit Development Mode</span>
    </div>
  );
};