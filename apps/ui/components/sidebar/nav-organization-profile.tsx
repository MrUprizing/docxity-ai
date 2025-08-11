"use client";

import { useClerk } from "@clerk/nextjs";
import { Building2 } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export const OrganizationProfileButton = () => {
  const { openOrganizationProfile } = useClerk();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip="Organization Settings"
        onClick={() => openOrganizationProfile()}
      >
        <Building2 />
        <span>Settings</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}; 