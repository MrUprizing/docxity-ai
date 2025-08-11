"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  return (
    // Clicking this button signs out a user
    // and redirects them to the home page "/".
    <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
};
