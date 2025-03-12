// This script directly patches the react-router-dom module to add useHistory
const fs = require('fs');
const path = require('path');

// Path to the react-router-dom index.js file
const reactRouterDomPath = path.resolve(
  __dirname,
  '../node_modules/react-router-dom/dist/index.js'
);

// Alternative path for ESM version
const reactRouterDomEsmPath = path.resolve(
  __dirname,
  '../node_modules/react-router-dom/dist/index.mjs'
);

// Custom useHistory implementation
const useHistoryImplementation = `
// Custom useHistory hook for compatibility with Looker Extension SDK
export function useHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return {
    push: (path) => navigate(path),
    replace: (path) => navigate(path, { replace: true }),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
    location: location
  };
}
`;

// Function to patch a file
function patchFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return false;
    }

    // Read the current file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if useHistory is already added
    if (content.includes('export function useHistory()')) {
      console.log(`useHistory hook already exists in ${filePath}`);
      return true;
    }
    
    // Find a good spot to insert our code - after useLocation and useNavigate are defined
    // Look for common patterns in both CJS and ESM modules
    let insertPosition = -1;
    
    // Try to find useNavigate and useLocation
    const navigatePos = content.indexOf('function useNavigate');
    const locationPos = content.indexOf('function useLocation');
    
    if (navigatePos !== -1 && locationPos !== -1) {
      // Find the end of the useLocation function
      const afterLocationPos = content.indexOf('function', locationPos + 1);
      if (afterLocationPos !== -1) {
        insertPosition = afterLocationPos;
      }
    }
    
    // If we couldn't find a good spot, try to find the export section
    if (insertPosition === -1) {
      const exportPos = content.indexOf('export {');
      if (exportPos !== -1) {
        insertPosition = exportPos;
      }
    }
    
    // Last resort: try to find the end of the file
    if (insertPosition === -1) {
      insertPosition = content.lastIndexOf('}');
    }
    
    if (insertPosition !== -1) {
      // Insert our useHistory implementation
      const newContent = 
        content.slice(0, insertPosition) + 
        useHistoryImplementation + 
        content.slice(insertPosition);
      
      // Write the modified file
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Successfully patched ${filePath} with useHistory hook`);
      return true;
    } else {
      console.error(`Could not find a suitable insertion point in ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error patching ${filePath}:`, error);
    return false;
  }
}

// Try to patch both CJS and ESM versions
let success = false;
if (fs.existsSync(reactRouterDomPath)) {
  success = patchFile(reactRouterDomPath) || success;
}
if (fs.existsSync(reactRouterDomEsmPath)) {
  success = patchFile(reactRouterDomEsmPath) || success;
}

// Also try to find and patch the actual file that's being used by the Looker Extension SDK
const nodeModulesDir = path.resolve(__dirname, '../node_modules');
function findReactRouterDomFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Skip node_modules within node_modules to avoid infinite recursion
      if (filePath.includes('node_modules/node_modules')) continue;
      
      findReactRouterDomFiles(filePath);
    } else if (file.name.endsWith('.js') || file.name.endsWith('.mjs')) {
      // Check if this file imports from react-router-dom
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('from "react-router-dom"') || 
            content.includes('from \'react-router-dom\'')) {
          // Check if this file is trying to use useHistory
          if (content.includes('useHistory')) {
            console.log(`Found file using useHistory: ${filePath}`);
            
            // If this is the RouteChangeListener from Looker SDK, patch it directly
            if (filePath.includes('RouteChangeListener')) {
              console.log(`Patching Looker SDK file: ${filePath}`);
              
              // Replace the import with our custom implementation
              const newContent = content.replace(
                /import\s*{\s*[^}]*useHistory[^}]*}\s*from\s*['"]react-router-dom['"]/,
                `import { useLocation, useNavigate } from 'react-router-dom';\n
                // Custom useHistory implementation
                function useHistory() {
                  const navigate = useNavigate();
                  const location = useLocation();
                  
                  return {
                    push: (path) => navigate(path),
                    replace: (path) => navigate(path, { replace: true }),
                    goBack: () => navigate(-1),
                    goForward: () => navigate(1),
                    location: location
                  };
                }`
              );
              
              if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Successfully patched ${filePath}`);
                success = true;
              }
            }
          }
        }
      } catch (error) {
        // Ignore errors reading files
      }
    }
  }
}

try {
  findReactRouterDomFiles(nodeModulesDir);
} catch (error) {
  console.error('Error searching for react-router-dom files:', error);
}

if (success) {
  console.log('Successfully patched at least one file');
} else {
  console.error('Failed to patch any files');
} 