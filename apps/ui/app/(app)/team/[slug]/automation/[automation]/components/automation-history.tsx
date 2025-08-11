import { Badge } from "@/components/ui/badge";
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

interface AutomationHistoryProps {
  automationId: string;
}

export async function AutomationHistory({
  automationId,
}: AutomationHistoryProps) {
  const prs = await getAutomationPrs(automationId);

  return (
    <div className="space-y-4">
      {prs.map((pr) => (
        <div
          key={pr.id}
          className="group relative rounded-lg border bg-card p-4 hover:border-primary/20 transition-all duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {pr.status === "completed" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <XCircle className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <a
                  href={pr.prUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline truncate max-w-[300px]"
                >
                  {pr.prTitle}
                </a>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {formatDistanceToNow(new Date(pr.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-[400px]">
                {pr.prDescription}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[150px]">
                    {pr.sourceRepo}
                  </span>
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                    {pr.sourceBranch}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitMerge className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[150px]">
                    {pr.targetRepo}
                  </span>
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                    {pr.targetBranch}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
