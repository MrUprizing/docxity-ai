import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <section>
      <header className="flex pt-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="">Dashboard </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <header className="space-y-0.5 px-8 py-5 w-full min-h-[100px] max-w-[76rem] mx-auto flex items-center justify-between">
        <div>
          <h1 className="tracking-tight text-4xl ">
            Morning {user?.firstName}
          </h1>
          <p className="text-muted-foreground">
            Heres a quick look at how things are going
          </p>
        </div>
        
      </header>
      <Separator />
      <section className="px-8 py-7 w-full min-h-[200px] max-w-[76rem] mx-auto">
        {children}
      </section>
    </section>
  );
}
