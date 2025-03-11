import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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
  root.render(
    <React.StrictMode>
      <App />
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
