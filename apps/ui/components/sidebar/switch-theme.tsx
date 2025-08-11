"use client";

import { Moon, Sun } from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "next-themes";
export default function SwitchTheme() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Sun className=" mr-1 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground size-4.5" />
        <Moon className=" mr-1 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground size-4.5" />
        Mode
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
