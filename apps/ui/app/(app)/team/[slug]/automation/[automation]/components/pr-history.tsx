import { ScrollArea } from "@/components/ui/scroll-area";
import { getAutomationPrs } from "@docxity/database";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCircle2,
  Clock,
  GitBranch,
  GitMerge,
  XCircle,
} from "lucide-react";

interface PRHistoryProps {
  automationId: string;
}

export async function PRHistory({ automationId }: PRHistoryProps) {
  const prs = await getAutomationPrs(automationId);

  return (
    <ScrollArea className="h-[calc(100vh-24rem)]">
      <div className="space-y-4 pr-4">
        {prs.map((pr) => (
          <div
            key={pr.id}
            className="group relative rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {pr.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <a
                    href={pr.prUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline truncate max-w-[300px]"
                  >
                    {pr.prTitle}
                  </a>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 max-w-[400px]">
                  {pr.prDescription}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Clock className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(pr.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-muted-foreground">Source</p>
                  <div className="flex items-center gap-1">
                    <span className="truncate max-w-[200px]">
                      {pr.sourceRepo}
                    </span>
                    <span className="text-muted-foreground/70 shrink-0">
                      ({pr.sourceBranch})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-muted-foreground">Target</p>
                  <div className="flex items-center gap-1">
                    <span className="truncate max-w-[200px]">
                      {pr.targetRepo}
                    </span>
                    <span className="text-muted-foreground/70 shrink-0">
                      ({pr.targetBranch})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
