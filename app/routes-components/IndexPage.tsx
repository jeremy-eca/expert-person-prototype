import React from "react";
import { useNavigate } from "react-router-dom";
import { List } from "~/modules/profile/components/List/List";
import { ThemeProvider } from "~/modules/profile/contexts/ThemeContext";

export function IndexPage() {
  const navigate = useNavigate();

  const handlePersonSelect = (personId: string | null) => {
    if (personId === null) {
      // Navigate to new person form
      navigate('/profile/new');
    } else {
      // Navigate to person detail
      navigate(`/profile/${personId}`);
    }
  };

  return (
    <ThemeProvider>
      <List onPersonSelect={handlePersonSelect} />
    </ThemeProvider>
  );
}