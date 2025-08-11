import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function NavConectionsSkeleton() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Connections</SidebarGroupLabel>
      <SidebarMenu>
        {["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
          <SidebarMenuItem key={key}>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-full bg-muted" />
                <Skeleton className="h-4 w-32 bg-muted" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
