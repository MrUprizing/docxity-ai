"use client";
import { GitBranch, LayoutPanelTop, Zap } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "next-view-transitions";
import { useParams, usePathname } from "next/navigation";
import { OrganizationProfileButton } from "./nav-organization-profile";

export function NavMain() {
  const pathname = usePathname();
  const params = useParams<{ slug: string }>();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Dashboard"
              className={
                pathname === `/team/${params.slug}` ? "bg-sidebar-accent" : ""
              }
            >
              <Link href={`/team/${params.slug}`} prefetch={true}>
                <LayoutPanelTop />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Manage Automations"
              className={
                pathname === `/team/${params.slug}/automation`
                  ? "bg-sidebar-accent"
                  : ""
              }
            >
              <Link href={`/team/${params.slug}/automation`} prefetch={true}>
                <Zap />
                <span>AI Automation</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Application Settings"
              className={
                pathname === `/team/${params.slug}/repositories`
                  ? "bg-sidebar-accent"
                  : ""
              }
            >
              <Link href={`/team/${params.slug}/repositories`} prefetch={true}>
                <GitBranch />
                <span>Repositories</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <OrganizationProfileButton />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
