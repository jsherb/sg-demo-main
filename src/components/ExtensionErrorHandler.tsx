import React, { useState, useEffect, useRef } from 'react';

interface ExtensionErrorHandlerProps {
  children: React.ReactNode;
}

// Define custom event types for Looker extension errors
interface LookerExtensionErrorEvent {
  type?: string;
  error?: string;
  chattyError?: string;
  message?: string | any;
  detail?: any;
}

export const ExtensionErrorHandler: React.FC<ExtensionErrorHandlerProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const pingIntervalRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Helper function to check if a string contains a substring
  const containsSubstring = (str: any, substr: string): boolean => {
    if (typeof str === 'string') {
      return str.indexOf(substr) !== -1;
    }
    return false;
  };

  // Function to attempt reconnection
  const attemptReconnect = () => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.log('Max reconnection attempts reached');
      setHasError(true);
      setErrorMessage('Unable to reconnect to Looker extension after multiple attempts. Please refresh the page.');
      return;
    }

    reconnectAttemptsRef.current += 1;
    console.log(`Attempting to reconnect (attempt ${reconnectAttemptsRef.current})`);
    
    // Clear existing ping interval
    if (pingIntervalRef.current) {
      window.clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    // Try to reconnect by reloading SDK data
    try {
      if (window.__LOOKER_EXTENSION_SDK__) {
        window.__LOOKER_EXTENSION_SDK__.lookerHostData();
        console.log('Reconnection successful');
        
        // Reset reconnect attempts on success
        reconnectAttemptsRef.current = 0;
        
        // Restart ping interval
        startPingInterval();
      }
    } catch (error) {
      console.log('Reconnection failed:', error);
      
      // Schedule another reconnection attempt
      reconnectTimeoutRef.current = window.setTimeout(() => {
        attemptReconnect();
      }, 5000); // Wait 5 seconds before trying again
    }
  };

  // Function to start the ping interval
  const startPingInterval = () => {
    // Clear any existing interval
    if (pingIntervalRef.current) {
      window.clearInterval(pingIntervalRef.current);
    }

    // Set up a new ping interval
    pingIntervalRef.current = window.setInterval(() => {
      try {
        // Simple ping to keep connection alive
        if (window.__LOOKER_EXTENSION_SDK__) {
          console.log('Sending ping to Looker host');
          window.__LOOKER_EXTENSION_SDK__.lookerHostData();
        }
      } catch (error) {
        console.log('Ping error:', error);
        attemptReconnect();
      }
    }, 10000); // Ping every 10 seconds
  };

  useEffect(() => {
    // Listen for extension connection errors
    const handleConnectionError = (event: MessageEvent) => {
      console.log('Message event received:', event);
      
      // Check for connection timeout in various formats
      const data = event.data as LookerExtensionErrorEvent;
      
      if (
        data && 
        (data.type === 'extension_error' || 
         data.error === 'connectionTimeout' || 
         data.chattyError === 'connectionTimeout' ||
         containsSubstring(data, 'connection') ||
         containsSubstring(data.message, 'connection'))
      ) {
        console.log('Connection error detected in message event');
        attemptReconnect();
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
         detail.chattyError === 'connectionTimeout' ||
         containsSubstring(detail, 'connection'))
      ) {
        console.log('Connection error detected in custom event');
        attemptReconnect();
      }
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      console.log('Error event:', event);
      
      // Check if the error is related to connection issues
      if (containsSubstring(event.message, 'connection') || 
          containsSubstring(event.message, 'network') ||
          containsSubstring(event.message, 'timeout')) {
        console.log('Connection-related error detected');
        attemptReconnect();
      } else {
        // For other errors, just show the error message
        setHasError(true);
        setErrorMessage('An error occurred in the extension. Please refresh the page.');
      }
    };

    // Handle unhandled rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('Unhandled rejection:', event);
      
      // Check if the rejection is related to connection issues
      const reason = event.reason?.toString() || '';
      if (containsSubstring(reason, 'connection') || 
          containsSubstring(reason, 'network') || 
          containsSubstring(reason, 'timeout')) {
        console.log('Connection-related rejection detected');
        attemptReconnect();
      }
    };

    // Start the ping interval
    startPingInterval();

    // Add event listeners
    window.addEventListener('message', handleConnectionError);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('extension_error', handleCustomEvent as EventListener);
    window.addEventListener('connectionTimeout', handleCustomEvent as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleConnectionError);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('extension_error', handleCustomEvent as EventListener);
      window.removeEventListener('connectionTimeout', handleCustomEvent as EventListener);
      
      // Clear intervals and timeouts
      if (pingIntervalRef.current) {
        window.clearInterval(pingIntervalRef.current);
      }
      
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
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