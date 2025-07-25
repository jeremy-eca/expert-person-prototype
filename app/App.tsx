import React, { useEffect } from "react";
import { AppRouter } from "./router";
import { initializeProfileDataService } from "./modules/profile/services/ProfileDataService";
import "./globals.css";

function App() {
  useEffect(() => {
    // Initialize ProfileDataService when app starts
    try {
      initializeProfileDataService({
        baseUrl: import.meta.env.VITE_EXPERT_PERSON_URL || 'http://localhost:3001',
        clientId: import.meta.env.VITE_HMAC_CLIENT_ID || 'your-client-id',
        secretKey: import.meta.env.VITE_HMAC_CLIENT_KEY || 'your-secret-key',
        tenantId: import.meta.env.VITE_TEST_TENANT_ID || 'your-tenant-id',
      });
      console.log('ProfileDataService initialized successfully');
    } catch (error) {
      console.warn('ProfileDataService initialization failed:', error);
      // Continue anyway - components will handle this gracefully
    }
  }, []);

  return <AppRouter />;
}

export default App;