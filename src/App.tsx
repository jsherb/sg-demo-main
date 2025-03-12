import React from 'react';
// Import Header but don't use it in Looker extension mode
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import { ProjectHeader } from './components/ProjectHeader';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { ExtensionErrorHandler } from './components/ExtensionErrorHandler';

// Check if we're running in Looker extension environment
const isLookerExtension = () => {
  // More reliable detection of Looker extension environment
  return window.location.href.includes('looker') || 
         window.location.href.includes('extension') ||
         window.location.hostname === 'localhost' ||
         typeof window.__LOOKER_EXTENSION_SDK__ !== 'undefined';
};

function App() {
  return (
    <ExtensionErrorHandler>
      <div className="h-screen flex flex-col">
        {/* Only show Header in non-Looker environments */}
        {!isLookerExtension() && <Header />}
        {/* Only show TopNav and ProjectHeader in non-Looker environments */}
        {!isLookerExtension() && <TopNav />}
        {!isLookerExtension() && <ProjectHeader />}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </ExtensionErrorHandler>
  );
}

export default App;