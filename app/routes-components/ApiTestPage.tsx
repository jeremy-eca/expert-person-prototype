import React from "react";
import { ApiTester } from "~/components/ApiTester";
import { ThemeProvider } from "~/modules/profile/contexts/ThemeContext";

export function ApiTestPage() {
  return (
    <ThemeProvider>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">API Endpoint Testing</h1>
        <ApiTester />
      </div>
    </ThemeProvider>
  );
}