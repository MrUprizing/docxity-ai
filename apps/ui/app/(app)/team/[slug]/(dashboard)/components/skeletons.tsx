import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CardsSkeleton() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<Card key={i} className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-4 w-24" />
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              <Skeleton className="h-8 w-16" />
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-24" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function RecentSkeleton() {
  return (
    <Card className="col-span-3 min-h-[430px] max-h-[430px]">
      <CardHeader className="pb-2">
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[250px] space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 