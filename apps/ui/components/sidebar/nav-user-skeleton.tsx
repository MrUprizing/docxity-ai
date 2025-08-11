import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsUpDown } from "lucide-react";

export function NavUserTriggerSkeleton() {
  return (
    <div className="flex items-center w-full px-2 py-1.5 gap-2">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <div className="flex-1 grid text-left text-sm leading-tight">
        <Skeleton className="h-4 w-24 mb-1 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>
      <ChevronsUpDown className="ml-auto size-4 opacity-40" />
    </div>
  );
}
