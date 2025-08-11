"use client";

import { useClerk } from "@clerk/nextjs";

interface UserProfileDialogProps {
  children: React.ReactNode;
}

export function UserProfileDialog({ children }: UserProfileDialogProps) {
  const { openUserProfile } = useClerk();

  return (
    <button onClick={() => openUserProfile()} className="w-full" type="button">
      {children}
    </button>
  );
}
