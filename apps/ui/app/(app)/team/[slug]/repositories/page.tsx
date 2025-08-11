import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import { getGithubInstallationsByOrgId } from "@docxity/database";
import { Folder, Github, Pencil } from "lucide-react";
import Link from "next/link";
import ButtonGithubApp from "./components/button-github-app";

export default async function Page() {
  const { orgId } = await auth();

  const installations = orgId ? await getGithubInstallationsByOrgId(orgId) : [];

  return (
    <section className="space-y-8 mb-10">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Repositories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
            <p className="text-muted-foreground">
              Connect your GitHub repositories to generate documentation
              automatically
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Integration
              </CardTitle>
              <CardDescription>
                Connect your GitHub repositories to enable automatic document
                generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ButtonGithubApp />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Repositories</CardTitle>
              <CardDescription>
                Manage your connected GitHub repositories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {installations && installations.length > 0 ? (
                <div className="space-y-4">
                  {installations.map((installation) => (
                    <div
                      key={installation.accountSlug}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Github className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">
                            {installation.accountSlug}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            GitHub Organization
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`https://github.com/${installation.accountSlug}?tab=repositories`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Folder className="h-4 w-4 mr-2" />
                            View Repositories
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`https://github.com/settings/installations/${installation.installationId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No repositories connected yet. Install the GitHub App to get
                  started.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
