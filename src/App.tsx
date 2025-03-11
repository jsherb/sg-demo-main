import React from 'react';
// Import Header but don't use it in Looker extension mode
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import { ProjectHeader } from './components/ProjectHeader';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

// Check if we're running in Looker extension environment
const isLookerExtension = () => {
  return window.location.href.includes('looker') || 
         window.location.href.includes('extension');
};

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* Only show Header in non-Looker environments */}
      {!isLookerExtension() && <Header />}
      <TopNav />
      <ProjectHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default App;