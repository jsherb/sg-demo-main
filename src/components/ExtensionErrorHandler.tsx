import React, { useState, useEffect } from 'react';

interface ExtensionErrorHandlerProps {
  children: React.ReactNode;
}

// Define custom event types for Looker extension errors
interface LookerExtensionErrorEvent {
  type?: string;
  error?: string;
  chattyError?: string;
}

export const ExtensionErrorHandler: React.FC<ExtensionErrorHandlerProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Listen for extension connection errors
    const handleConnectionError = (event: MessageEvent) => {
      console.log('Message event received:', event);
      
      // Check for connection timeout in various formats
      const data = event.data as LookerExtensionErrorEvent;
      
      if (
        (data && 
         (data.type === 'extension_error' || 
          data.error === 'connectionTimeout' || 
          data.chattyError === 'connectionTimeout'))
      ) {
        console.log('Connection error detected');
        setHasError(true);
        setErrorMessage('Connection to Looker extension has timed out. Please refresh the page.');
      }
    };

    // Handle custom events that might be dispatched by Looker
    const handleCustomEvent = (event: CustomEvent) => {
      console.log('Custom event received:', event);
      
      const detail = event.detail as LookerExtensionErrorEvent;
      
      if (
        detail && 
        (detail.type === 'extension_error' || 
         detail.error === 'connectionTimeout' || 
         detail.chattyError === 'connectionTimeout')
      ) {
        console.log('Connection error detected in custom event');
        setHasError(true);
        setErrorMessage('Connection to Looker extension has timed out. Please refresh the page.');
      }
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      console.log('Error event:', event);
      setHasError(true);
      setErrorMessage('An error occurred in the extension. Please refresh the page.');
    };

    // Set up a ping mechanism to keep the connection alive
    const pingInterval = setInterval(() => {
      try {
        // Simple ping to keep connection alive
        if (window.__LOOKER_EXTENSION_SDK__) {
          console.log('Sending ping to Looker host');
          window.__LOOKER_EXTENSION_SDK__.lookerHostData();
        }
      } catch (error) {
        console.log('Ping error:', error);
      }
    }, 15000); // Ping every 15 seconds (more frequent)

    // Add event listeners
    window.addEventListener('message', handleConnectionError);
    window.addEventListener('error', handleError);
    window.addEventListener('extension_error', handleCustomEvent as EventListener);
    window.addEventListener('connectionTimeout', handleCustomEvent as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleConnectionError);
      window.removeEventListener('error', handleError);
      window.removeEventListener('extension_error', handleCustomEvent as EventListener);
      window.removeEventListener('connectionTimeout', handleCustomEvent as EventListener);
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