import { Folder, Forward, Github, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import { getGithubInstallationsByOrgId } from "@docxity/database";
import { Link } from "next-view-transitions";

export async function NavConections() {
  const { orgId } = await auth();
  if (!orgId) {
    return <div>no team</div>;
  }
  const conections = await getGithubInstallationsByOrgId(orgId);
  if (!conections) {
    return <div>no conections</div>;
  }
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Connections</SidebarGroupLabel>
      <SidebarMenu>
        {conections.map((item) => (
          <SidebarMenuItem key={item.accountSlug}>
            <SidebarMenuButton asChild>
              <Link
                href={`https://github.com/${item.accountSlug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
                <span>{item.accountSlug}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={"right"}
                align={"start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
