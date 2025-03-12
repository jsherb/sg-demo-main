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
    
    // Set up a ping interval to keep the connection alive
    if (isExtension) {
      const pingInterval = setInterval(() => {
        // Send a message to the parent window to keep the connection alive
        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage({ type: 'EXTENSION_PING' }, '*');
          } catch (error) {
            console.error('Error sending ping to parent window:', error);
          }
        }
      }, 5000); // Send ping every 5 seconds
      
      return () => {
        clearInterval(pingInterval);
      };
    }
  }, [isExtension]);

  return (
    <ExtensionErrorHandler>
      <div className="h-screen flex flex-col">
        {/* Only show Header in non-Looker environments */}
        {!isExtension && <Header />}
        {/* Only show TopNav and ProjectHeader in non-Looker environments */}
        {!isExtension && <TopNav />}
        {!isExtension && <ProjectHeader />}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </ExtensionErrorHandler>
  );
}

export default App;