import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Find or create root element
  let rootElement = document.getElementById('root');
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }
  
  // Use legacy render method for better compatibility
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
});
