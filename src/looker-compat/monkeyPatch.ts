// This file contains a monkey patch for the react-router-dom module
// to provide compatibility between React Router v6 and the Looker Extension SDK

// Function to monkey patch the react-router-dom module
export function applyMonkeyPatch() {
  try {
    // Get the original module
    const reactRouterDom = require('react-router-dom');
    
    // Add our useHistory hook to the module
    if (!(reactRouterDom as any).useHistory && (window as any).__lookerUseHistory) {
      console.log('Applying monkey patch for useHistory hook');
      (reactRouterDom as any).useHistory = (window as any).__lookerUseHistory;
      
      // Also patch the module in the global scope
      (window as any).reactRouterDom = reactRouterDom;
    }
  } catch (error) {
    console.error('Error applying monkey patch:', error);
  }
} 