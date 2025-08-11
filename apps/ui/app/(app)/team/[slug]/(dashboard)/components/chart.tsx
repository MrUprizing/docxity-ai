"use client";

import { getDashboardData } from "@/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/types/dashboard";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  views: {
    label: "Documents",
  },
  docs: {
    label: "Generated",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>
          <Skeleton className="h-4 w-32" />
        </CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          <Skeleton className="h-8 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="aspect-auto h-[250px] w-full">
          <div className="flex h-full w-full flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-full w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SectionChart() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        if (!result.error) {
          setData(result as DashboardData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <ChartSkeleton />;
  }

  if (!data || data.error) {
    return <div>Error loading dashboard data</div>;
  }

  const chartData = [
    {
      date: "Today",
      docs: data.totalDocsGenerated,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardDescription>Document Generation</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {data.totalDocsGenerated} Total
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent className="w-[150px]" nameKey="views" />
              }
            />
            <Bar dataKey="docs" fill={"var(--chart-1)"} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
