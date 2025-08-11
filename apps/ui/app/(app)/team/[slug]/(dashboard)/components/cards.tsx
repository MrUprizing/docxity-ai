import { getDashboardData } from "@/actions";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardData } from "@/types/dashboard";
import { TrendingUpIcon } from "lucide-react";

export async function SectionCards() {
  const result = await getDashboardData();
  const data = result as DashboardData;

  if (!data || data.error) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Docs Generated</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data.totalDocsGenerated}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total documents generated <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Across all repositories</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Automations</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data.activeAutomations}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data.activeAutomations > 0 ? "Running" : "No active"} automations
          </div>
          <div className="text-muted-foreground">
            Out of {data.totalAutomations} total
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Success Rate</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data.successRate}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Document generation success <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on total automations
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Automations</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data.totalAutomations}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total automations created <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Across all repositories</div>
        </CardFooter>
      </Card>
    </div>
  );
}