"use client";

import { SearchIcon, LayoutPanelTop, Zap, GitBranch } from "lucide-react";
import * as React from "react";
import { useParams } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SidebarMenuButton } from "../ui/sidebar";
import Link from "next/link";

export default function SearchSidebar() {
  const [open, setOpen] = React.useState(false);
  const params = useParams<{ slug: string }>();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <SidebarMenuButton
        className="hover:bg-sidebar"
        asChild
        tooltip="Search (⌘K)"
      >
        <button
          type="button"
          className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-9 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
          onClick={() => setOpen(true)}
        >
          <span className="flex grow items-center">
            <SearchIcon
              className="text-muted-foreground/80 -ms-[1px] me-3"
              size={16}
              aria-hidden="true"
            />
            <span className="text-muted-foreground/70 font-normal">Search</span>
          </span>
          <kbd className="bg-background text-muted-foreground/70 ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            ⌘K
          </kbd>
        </button>
      </SidebarMenuButton>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem asChild>
              <Link href={`/team/${params.slug}`} prefetch={true}>
                <LayoutPanelTop
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to Dashboard</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href={`/team/${params.slug}/automation`} prefetch={true}>
                <Zap size={16} className="opacity-60" aria-hidden="true" />
                <span>Go to AI Automation</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href={`/team/${params.slug}/repositories`} prefetch={true}>
                <GitBranch
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to Repositories</span>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
