import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Function to ensure we have a root element
const getRootElement = () => {
  let rootElement = document.getElementById('root');
  
  // If root element doesn't exist, create it
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }
  
  return rootElement;
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = getRootElement();
  
  // Create root and render app
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error rendering React application:', error);
    
    // Fallback to legacy render method if createRoot fails
    try {
      // @ts-ignore - For compatibility with older React versions
      ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        rootElement
      );
    } catch (fallbackError) {
      console.error('Fallback render also failed:', fallbackError);
      rootElement.innerHTML = '<div style="color: red; padding: 20px;">Failed to initialize application. Check console for errors.</div>';
    }
  }
});
