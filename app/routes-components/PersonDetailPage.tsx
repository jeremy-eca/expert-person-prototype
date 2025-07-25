import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AltRightPanel } from "~/modules/profile/components/AltRightPanel/AltRightPanel";
import { ThemeProvider } from "~/modules/profile/contexts/ThemeContext";

export function PersonDetailPage() {
  const { id: personId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  if (!personId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">Person ID is required</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AltRightPanel personId={personId} onBack={handleBack} />
    </ThemeProvider>
  );
}