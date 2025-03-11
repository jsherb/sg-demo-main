import React from 'react';
import ReactDOM from 'react-dom';
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
  
  // Use legacy render method for better compatibility with Looker extensions
  // Using React.createElement directly instead of JSX to avoid JSX runtime issues
  ReactDOM.render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(App, null)
    ),
    rootElement
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
