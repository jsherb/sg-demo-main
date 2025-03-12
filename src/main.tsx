import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ExtensionWrapper from './ExtensionWrapper';
import './fonts.css'; // Import fonts first
import './index.css';

// Check if we're running in Looker extension environment
const isLookerExtension = () => {
  // Simple check based on URL
  return window.location.href.includes('looker') || 
         window.location.href.includes('extension');
};

// Function to initialize the application
function initialize() {
  // Find or create root element
  let rootElement = document.getElementById('root');
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }
  
  // Use modern createRoot method for React 18
  const root = ReactDOM.createRoot(rootElement);
  
  // Use ExtensionWrapper in Looker environment, otherwise use App directly
  const isExtension = isLookerExtension();
  console.log('Initializing in extension mode:', isExtension);
  
  root.render(
    <React.StrictMode>
      {isExtension ? <ExtensionWrapper /> : <App />}
    </React.StrictMode>
  );
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  // DOM already loaded, initialize immediately
  initialize();
}

// Export initialize function for Looker extension
export { initialize };
