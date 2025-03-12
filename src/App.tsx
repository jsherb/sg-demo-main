import React, { useEffect } from 'react';
// Import Header but don't use it in Looker extension mode
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import { ProjectHeader } from './components/ProjectHeader';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { ExtensionErrorHandler } from './components/ExtensionErrorHandler';

// Check if we're running in Looker extension environment
const isLookerExtension = () => {
  // Simple check based on URL
  return window.location.href.includes('looker') || 
         window.location.href.includes('extension');
};

function App() {
  // Determine if we're in extension mode once at startup
  const isExtension = isLookerExtension();
  
  // Log environment information for debugging
  useEffect(() => {
    console.log('App initialized');
    console.log('Running in Looker extension environment:', isExtension);
    console.log('Window location:', window.location.href);
  }, [isExtension]);

  return (
    <ExtensionErrorHandler>
      <div className="h-screen flex flex-col">
        {/* Only show Header in non-Looker environments */}
        {!isExtension && <Header />}
        {/* Only show TopNav in non-Looker environments */}
        {!isExtension && <TopNav />}
        {/* Always show ProjectHeader - this is the change */}
        <ProjectHeader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </ExtensionErrorHandler>
  );
}

export default App;