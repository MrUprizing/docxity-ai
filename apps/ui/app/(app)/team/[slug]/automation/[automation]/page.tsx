import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getAutomationById } from "@docxity/database";
import { ArrowRight, GitBranch, GitMerge } from "lucide-react";
import { notFound } from "next/navigation";
import { AutomationHistory } from "./components/automation-history";

interface AutomationPageProps {
  params: {
    slug: string;
    automation: string;
  };
}

export default async function AutomationPage({ params }: AutomationPageProps) {
  const automation = await getAutomationById(params.automation);

  if (!automation) {
    notFound();
  }

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
                <BreadcrumbLink href="/team/[slug]/automation">
                  Automation
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{automation.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <header className="space-y-0.5 px-8 py-5 w-full min-h-[100px] max-w-[76rem] mx-auto flex items-center justify-between">
        <div>
          <h1 className="tracking-tight text-4xl">{automation.name}</h1>
          <p className="text-muted-foreground">
            {automation.description || "Configure your automation settings"}
          </p>
        </div>
      </header>
      <Separator />
      <section className="px-8 py-7 w-full min-h-[200px] max-w-[76rem] mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Automation Flow */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[2px] bg-border" />
            </div>
            <div className="relative grid grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <GitBranch className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Source Repository</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Where changes originate
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Repository
                      </Label>
                      <p className="text-sm font-medium mt-1 truncate">
                        {automation.sourceRepo}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs">Branch</Label>
                      <Badge variant="secondary" className="mt-1">
                        {automation.sourceBranch}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center">
                <div className="p-2 rounded-full bg-primary/10">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <GitMerge className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Target Repository</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Where changes are applied
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Repository
                      </Label>
                      <p className="text-sm font-medium mt-1 truncate">
                        {automation.targetRepo || "Not configured"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs">Branch</Label>
                      <Badge variant="secondary" className="mt-1">
                        {automation.targetBranch}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* History */}
          <div className="flex flex-col gap-3 mb-6">
            <h3 className="text-3xl font-medium">Automation History</h3>
            <p className="text-muted-foreground mt-0.5">
              Track all automation activities
            </p>
          </div>
          <AutomationHistory automationId={automation.id} />
        </div>
      </section>
    </section>
  );
}
