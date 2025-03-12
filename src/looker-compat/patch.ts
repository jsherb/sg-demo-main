// This file patches the react-router-dom module to provide compatibility
// between React Router v6 and the Looker Extension SDK which expects v5

import { useHistory } from './RouterCompat';

// Create a global variable to store the useHistory hook
// This is a hack, but it's necessary to make the Looker Extension SDK work with React Router v6
(window as any).__lookerUseHistory = useHistory;

// We'll use this in our monkey patch later
export { useHistory }; 