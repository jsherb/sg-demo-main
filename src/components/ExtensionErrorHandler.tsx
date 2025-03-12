import React, { useState, useEffect } from 'react';

interface ExtensionErrorHandlerProps {
  children: React.ReactNode;
}

export const ExtensionErrorHandler: React.FC<ExtensionErrorHandlerProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Listen for extension connection errors
    const handleConnectionError = (event: any) => {
      if (event.detail?.type === 'extension_error' || 
          event.detail?.error === 'connectionTimeout' ||
          event.detail?.chattyError === 'connectionTimeout') {
        setHasError(true);
        setErrorMessage('Connection to Looker extension has timed out. Please refresh the page.');
      }
    };

    window.addEventListener('message', handleConnectionError);
    window.addEventListener('error', () => {
      setHasError(true);
      setErrorMessage('An error occurred in the extension. Please refresh the page.');
    });

    // Set up a ping mechanism to keep the connection alive
    const pingInterval = setInterval(() => {
      // Send a ping to the Looker extension host
      if (typeof window.__LOOKER_EXTENSION_SDK__ !== 'undefined') {
        try {
          // Simple ping to keep connection alive
          window.__LOOKER_EXTENSION_SDK__.lookerHostData();
        } catch (error) {
          console.log('Ping error:', error);
        }
      }
    }, 30000); // Ping every 30 seconds

    return () => {
      window.removeEventListener('message', handleConnectionError);
      window.removeEventListener('error', () => {});
      clearInterval(pingInterval);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Extension Error</h2>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Add a type definition for the Looker Extension SDK
declare global {
  interface Window {
    __LOOKER_EXTENSION_SDK__?: {
      lookerHostData: () => any;
    };
  }
} 