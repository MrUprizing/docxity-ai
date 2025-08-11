import { NavConections } from "@/components/sidebar/nav-conections";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Suspense } from "react";
import { NavConectionsSkeleton } from "./nav-conections-skeleton";
import { NavUserTriggerSkeleton } from "./nav-user-skeleton";
import SearchSidebar from "./search-sidebar";

export async function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher />
        <SearchSidebar />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <Suspense fallback={<NavConectionsSkeleton />}>
          <NavConections />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<NavUserTriggerSkeleton />}>
          <NavUser />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
