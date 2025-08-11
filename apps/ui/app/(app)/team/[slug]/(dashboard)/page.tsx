import { Suspense } from "react";
import { SectionCards } from "./components/cards";
import { SectionChart } from "./components/chart";
import { RecentSales } from "./components/recent";
import { CardsSkeleton, RecentSkeleton } from "./components/skeletons";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Suspense fallback={<CardsSkeleton />}>
            <SectionCards />
          </Suspense>
          <div className="flex flex-row gap-4 w-full">
            <div className="flex-[1.5] min-w-0">
              <SectionChart />
            </div>
            <div className="flex-1 min-w-0">
              <Suspense fallback={<RecentSkeleton />}>
                <RecentSales />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
