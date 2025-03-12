import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExtensionProvider } from '@looker/extension-sdk-react';
import MainContent from './components/MainContent';

// Custom error boundary to catch and handle errors in the extension
class ExtensionErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console
    console.error('Extension error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Extension Error</h3>
          <p className="text-gray-600 mb-6">
            {this.state.errorMessage || 'An error occurred in the extension.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#1A73E8] text-white rounded hover:bg-[#1557b0] transition-colors text-sm font-medium"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// This component wraps the entire application with the Looker Extension Provider
// to properly initialize the connection with the Looker host
const ExtensionWrapper: React.FC = () => {
  return (
    <ExtensionErrorBoundary>
      <ExtensionProvider
        requiredLookerVersion=">=21.0.0"
        chattyTimeout={-1} // Disable the chatty timeout to prevent connection issues
      >
        <MainContent />
      </ExtensionProvider>
    </ExtensionErrorBoundary>
  );
};

export default ExtensionWrapper; 