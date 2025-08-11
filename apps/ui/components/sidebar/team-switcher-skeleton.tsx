import { Dialog } from "@/components/ui/dialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton loader for TeamSwitcher component
export function TeamSwitcherSkeleton() {
  return (
    <Dialog>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="flex items-center gap-3"
            disabled
          >
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 grid text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24 mb-1 rounded" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Dialog>
  );
}
