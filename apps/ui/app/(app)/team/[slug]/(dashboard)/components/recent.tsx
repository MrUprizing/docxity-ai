import { getDashboardData } from "@/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardData } from "@/types/dashboard";
import { formatDistanceToNow } from "date-fns";
import { GitBranch } from "lucide-react";

export async function RecentSales() {
  const result = await getDashboardData();
  const data = result as DashboardData;

  if (!data || data.error) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <Card className="col-span-3 min-h-[430px] max-h-[430px]">
      <CardHeader className="pb-2">
        <CardTitle>Recent Pull Requests</CardTitle>
        <CardDescription>
          {data.totalDocsGenerated} total documents generated
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[250px] space-y-3">
          {data.recentAutomations.map((automation) => (
            <div
              key={automation.lastPr.id}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium line-clamp-1">
                  {automation.lastPr.prTitle || automation.sourceRepo}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {automation.lastPr.prUrl && (
                  <a
                    href={automation.lastPr.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline whitespace-nowrap"
                  >
                    View PR
                  </a>
                )}
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(automation.lastPr.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))}
          {data.recentAutomations.length === 0 && (
            <div className="flex h-[150px] items-center justify-center text-sm text-muted-foreground">
              No recent pull requests found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
