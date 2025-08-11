import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import {
  getAutomationsByOrgId,
  getGithubInstallationsByOrgId,
} from "@docxity/database";
import { getAllAccessibleRepos } from "@docxity/github";
import {
  CheckCircle2,
  Circle,
  GitBranch,
  GitMerge,
  // biome-ignore lint/correctness/noUnusedImports: <explanation>
  GithubIcon,
  LucideGithub,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "next-view-transitions";
import DialogCreate from "./components/dialog-create";

export default async function Page() {
  const { orgId } = await auth();
  if (!orgId) {
    return <div>Unauthorized</div>;
  }

  // Fetch all GitHub installations for the current org
  const connections = await getGithubInstallationsByOrgId(orgId);

  // Normalize the connections to have the correct types
  const normalizedConnections = connections.map(
    (conn: { installationId: string; accountSlug: string | null }) => ({
      installationId: Number(conn.installationId),
      accountSlug: conn.accountSlug ?? "",
    }),
  );

  // Fetch all repos for each installation using the normalized array
  const reposByConnection: Record<
    number,
    { id: number; name: string; full_name: string }[]
  > = {};
  await Promise.all(
    normalizedConnections.map(async (conn) => {
      const repos = await getAllAccessibleRepos(conn.installationId);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      reposByConnection[conn.installationId] = repos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
      }));
    }),
  );

  const automations = await getAutomationsByOrgId(orgId);

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
                <BreadcrumbLink href="">Automation </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <header className="space-y-0.5 px-8 py-5 w-full min-h-[100px] max-w-[76rem] mx-auto flex items-center justify-between">
        <div>
          <h1 className="tracking-tight text-4xl ">Ai automation</h1>
          <p className="text-muted-foreground">
            Create and manage your Ai automations
          </p>
        </div>
        <div className="flex gap-2">
          <DialogCreate
            connections={normalizedConnections}
            reposByConnection={reposByConnection}
          />
        </div>
      </header>
      <Separator />
      <section className="px-8 py-7 w-full min-h-[200px] max-w-[76rem] mx-auto">
        <div className="flex flex-col gap-3">
          {automations.map((automation) => {
            const sourceRepoName =
              automation.sourceRepo?.split("/").pop() || "";
            const targetRepoName =
              automation.targetRepo?.split("/").pop() || "";
            const sourceRepoOwner = automation.sourceRepo?.split("/")[0] || "";

            return (
              <Link
                href={`automation/${automation.id}`}
                key={automation.id}
                className="group flex items-center justify-between bg-card border rounded-lg px-4 py-3 hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex flex-1 items-center gap-4 min-w-0">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {automation.name}
                      </span>
                      {automation.active ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LucideGithub className="w-3.5 h-3.5" />
                      <span className="truncate">{sourceRepoOwner}</span>
                      {automation.description && (
                        <span className="text-muted-foreground/70">
                          • {automation.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4" />
                      <span>{sourceRepoName}</span>
                      <span className="text-muted-foreground/70">
                        ({automation.sourceBranch})
                      </span>
                    </div>
                    {automation.targetRepo && (
                      <div className="flex items-center gap-1.5">
                        <GitMerge className="w-4 h-4" />
                        <span>{targetRepoName}</span>
                        <span className="text-muted-foreground/70">
                          ({automation.targetBranch})
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </section>
  );
}
