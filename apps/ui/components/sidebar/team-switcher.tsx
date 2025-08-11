"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useOrganizationList } from "@clerk/nextjs";
import { ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DialogCreateOrganization } from "./create-organization";
import { TeamSwitcherSkeleton } from "./team-switcher-skeleton";

export function TeamSwitcher() {
  // Get the list of organizations the user belongs to
  const { setActive, userMemberships, isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  // Get the first organization as the active team
  const activeTeam = userMemberships.data?.[0]?.organization;

  if (!isLoaded) {
    return <TeamSwitcherSkeleton />;
  }
  return (
    <Dialog>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={activeTeam?.imageUrl || ""}
                    alt={activeTeam?.name}
                  />
                  <AvatarFallback className="rounded-lg">Dx</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeTeam?.name ?? "No Team"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={"right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Teams
              </DropdownMenuLabel>
              {(userMemberships.data ?? []).map((mem, index) => (
                <DropdownMenuItem
                  key={mem.organization.id}
                  onClick={() =>
                    setActive?.({ organization: mem.organization.id })
                  }
                  className="cursor-pointer"
                  asChild
                >
                  <Link href={`/team/${mem.organization.slug}`} prefetch={true}>
                    <Avatar className="h-6 w-6 rounded-md">
                      <AvatarImage
                        src={mem.organization.imageUrl || ""}
                        alt={mem.organization.name}
                      />
                      <AvatarFallback className="rounded-md">Dx</AvatarFallback>
                    </Avatar>
                    {mem.organization.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Add team
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogCreateOrganization />
    </Dialog>
  );
}
