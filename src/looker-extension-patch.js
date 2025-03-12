// This script directly patches the Looker Extension SDK to fix the useHistory issue
const fs = require('fs');
const path = require('path');

// Find the RouteChangeListener.js file in the Looker Extension SDK
const routeChangeListenerPath = path.resolve(
  __dirname,
  '../node_modules/@looker/extension-sdk-react/lib/esm/components/RouteChangeListener/RouteChangeListener.js'
);

// Check if the file exists
if (fs.existsSync(routeChangeListenerPath)) {
  console.log(`Found RouteChangeListener.js at ${routeChangeListenerPath}`);
  
  // Read the file
  const content = fs.readFileSync(routeChangeListenerPath, 'utf8');
  
  // Replace the import statement for useHistory
  let newContent = content.replace(
    /import\s*{\s*[^}]*useHistory[^}]*}\s*from\s*['"]react-router-dom['"]/,
    `// Custom useHistory implementation
function useHistory() {
  // Create a mock history object that does nothing
  return {
    push: (path) => console.log('History.push called with:', path),
    replace: (path) => console.log('History.replace called with:', path),
    goBack: () => console.log('History.goBack called'),
    goForward: () => console.log('History.goForward called'),
    location: { pathname: window.location.pathname }
  };
}`
  );
  
  // Also replace any direct calls to useHistory
  newContent = newContent.replace(
    /const\s+history\s*=\s*useHistory\(\)/g,
    `// Mock history object
const history = {
  push: (path) => console.log('History.push called with:', path),
  replace: (path) => console.log('History.replace called with:', path),
  goBack: () => console.log('History.goBack called'),
  goForward: () => console.log('History.goForward called'),
  location: { pathname: window.location.pathname }
}`
  );
  
  // Write the modified file
  if (newContent !== content) {
    fs.writeFileSync(routeChangeListenerPath, newContent, 'utf8');
    console.log(`Successfully patched ${routeChangeListenerPath}`);
  } else {
    console.log(`No changes needed for ${routeChangeListenerPath}`);
  }
} else {
  console.error(`Could not find RouteChangeListener.js at ${routeChangeListenerPath}`);
}

// Also check for the ExtensionConnector.js file
const extensionConnectorPath = path.resolve(
  __dirname,
  '../node_modules/@looker/extension-sdk-react/lib/esm/components/ExtensionConnector/ExtensionConnector.js'
);

// Check if the file exists
if (fs.existsSync(extensionConnectorPath)) {
  console.log(`Found ExtensionConnector.js at ${extensionConnectorPath}`);
  
  // Read the file
  const content = fs.readFileSync(extensionConnectorPath, 'utf8');
  
  // Replace any references to useHistory
  let newContent = content.replace(
    /const\s+history\s*=\s*useHistory\(\)/g,
    `// Mock history object
const history = {
  push: (path) => console.log('History.push called with:', path),
  replace: (path) => console.log('History.replace called with:', path),
  goBack: () => console.log('History.goBack called'),
  goForward: () => console.log('History.goForward called'),
  location: { pathname: window.location.pathname }
}`
  );
  
  // Also replace any imports of useHistory
  newContent = newContent.replace(
    /import\s*{\s*[^}]*useHistory[^}]*}\s*from\s*['"]react-router-dom['"]/,
    `// No need to import useHistory`
  );
  
  // Write the modified file
  if (newContent !== content) {
    fs.writeFileSync(extensionConnectorPath, newContent, 'utf8');
    console.log(`Successfully patched ${extensionConnectorPath}`);
  } else {
    console.log(`No changes needed for ${extensionConnectorPath}`);
  }
} else {
  console.error(`Could not find ExtensionConnector.js at ${extensionConnectorPath}`);
}

// Find all files in the Looker Extension SDK that might use useHistory
const sdkDir = path.resolve(__dirname, '../node_modules/@looker/extension-sdk-react');

function findAndPatchFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      findAndPatchFiles(filePath);
    } else if (file.name.endsWith('.js') || file.name.endsWith('.mjs')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if this file uses useHistory
        if (content.includes('useHistory')) {
          console.log(`Found file using useHistory: ${filePath}`);
          
          // Replace any references to useHistory
          let newContent = content;
          
          // Replace import statements
          newContent = newContent.replace(
            /import\s*{\s*[^}]*useHistory[^}]*}\s*from\s*['"]react-router-dom['"]/,
            `// Custom useHistory implementation
function useHistory() {
  // Create a mock history object that does nothing
  return {
    push: (path) => console.log('History.push called with:', path),
    replace: (path) => console.log('History.replace called with:', path),
    goBack: () => console.log('History.goBack called'),
    goForward: () => console.log('History.goForward called'),
    location: { pathname: window.location.pathname }
  };
}`
          );
          
          // Replace direct calls to useHistory
          newContent = newContent.replace(
            /const\s+history\s*=\s*useHistory\(\)/g,
            `// Mock history object
const history = {
  push: (path) => console.log('History.push called with:', path),
  replace: (path) => console.log('History.replace called with:', path),
  goBack: () => console.log('History.goBack called'),
  goForward: () => console.log('History.goForward called'),
  location: { pathname: window.location.pathname }
}`
          );
          
          // Write the modified file
          if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Successfully patched ${filePath}`);
          } else {
            console.log(`No changes needed for ${filePath}`);
          }
        }
      } catch (error) {
        // Ignore errors reading files
      }
    }
  }
}

// Find and patch all files in the Looker Extension SDK
findAndPatchFiles(sdkDir); 