import React, { useEffect, useState } from 'react';
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
  const [sdkAvailable, setSdkAvailable] = useState(false);
  const [isExtension, setIsExtension] = useState(isLookerExtension());

  // Log environment information for debugging
  useEffect(() => {
    console.log('App initialized');
    console.log('Running in Looker extension environment:', isExtension);
    console.log('Window location:', window.location.href);
    
    // Check SDK availability
    const checkSdk = () => {
      const available = typeof window.__LOOKER_EXTENSION_SDK__ !== 'undefined';
      console.log('Looker SDK available:', available);
      setSdkAvailable(available);
      
      // Try to access the Looker SDK
      if (available && window.__LOOKER_EXTENSION_SDK__) {
        try {
          window.__LOOKER_EXTENSION_SDK__.lookerHostData();
          console.log('Looker SDK initialized successfully');
        } catch (error) {
          console.error('Error accessing Looker SDK:', error);
        }
      } else if (isExtension) {
        // If we're in an extension but SDK is not available, try again after a delay
        setTimeout(checkSdk, 1000);
      }
    };
    
    checkSdk();
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