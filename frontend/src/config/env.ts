export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Application
  appName: import.meta.env.VITE_APP_NAME || 'Cleaning Service',
} as const; 