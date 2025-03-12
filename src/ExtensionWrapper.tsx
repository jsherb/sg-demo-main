import React from 'react';
import { ExtensionProvider } from '@looker/extension-sdk-react';
import MainContent from './components/MainContent';

// This component wraps the entire application with the Looker Extension Provider
// to properly initialize the connection with the Looker host
const ExtensionWrapper: React.FC = () => {
  return (
    <ExtensionProvider
      requiredLookerVersion=">=21.0.0"
    >
      <MainContent />
    </ExtensionProvider>
  );
};

export default ExtensionWrapper; 