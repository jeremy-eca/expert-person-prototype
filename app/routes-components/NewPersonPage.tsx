import React from "react";
import { useNavigate } from "react-router-dom";
import { AltRightPanel } from "~/modules/profile/components/AltRightPanel/AltRightPanel";
import { ThemeProvider } from "~/modules/profile/contexts/ThemeContext";

export function NewPersonPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <ThemeProvider>
      <AltRightPanel personId={null} onBack={handleBack} />
    </ThemeProvider>
  );
}