import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { signJwt } from "@docxity/utils";
import { Github } from "lucide-react";

export default async function ButtonGithubApp() {
  const { userId, orgId, orgSlug } = await auth();
  const token = signJwt({ userId, orgId, orgSlug }, { expiresIn: "5m" });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          Connect GitHub Repository
        </CardTitle>
        <CardDescription>
          Install Docxity GitHub App to enable automatic document generation
          from your repositories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" size="lg" asChild>
          <a
            href={`https://github.com/apps/docxity-test/installations/new?state=${token}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            Install GitHub App
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
