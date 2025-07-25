import React from "react";
import { NavigationMenuSection } from "./sections/NavigationMenuSection";
import { TalentListSection } from "./sections/TalentListSection/TalentListSection";

interface ListProps {
  onPersonSelect: (personId: string | null) => void;
}

export const List = ({ onPersonSelect }: ListProps): JSX.Element => {
  return (
    <main className="flex min-h-screen w-full bg-[#f7fbfe]">
      <NavigationMenuSection />
      <TalentListSection onPersonSelect={onPersonSelect} />
    </main>
  );
};
