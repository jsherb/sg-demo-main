import React, { useState, useEffect } from 'react';

interface ExtensionErrorHandlerProps {
  children: React.ReactNode;
}

export const ExtensionErrorHandler: React.FC<ExtensionErrorHandlerProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      console.log('Error event:', event);
      
      // For all errors, just show the error message
      setHasError(true);
      setErrorMessage('An error occurred in the extension. Please refresh the page.');
    };

    // Handle unhandled rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('Unhandled rejection:', event);
      
      setHasError(true);
      setErrorMessage('An unexpected error occurred. Please refresh the page.');
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
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