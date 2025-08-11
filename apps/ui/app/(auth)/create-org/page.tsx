"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizationList } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Regex to allow only letters, numbers, and hyphens for the slug
const slugRegex = /^[a-z0-9-]*$/;

export default function CreateOrgPage() {
  const { isLoaded, createOrganization, setActive } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slugRegex.test(organizationSlug) || organizationSlug.trim() === "") {
      setSlugError(
        "Slug can only contain letters, numbers, and hyphens, and cannot be empty.",
      );
      return;
    }
    setSlugError(null);

    if (!isLoaded || !createOrganization) return;
    setLoading(true);
    try {
      const org = await createOrganization({
        name: organizationName,
        slug: organizationSlug,
      });

      // Activate the newly created organization
      if (setActive) {
        await setActive({ organization: org.id });
      }

      router.push(`/team/${org.slug}`);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-zinc-100">
            Create Organization
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Set up your team workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-200">
                Organization Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Acme Inc"
                disabled={loading}
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-zinc-200">
                Organization Slug <span className="text-red-500">*</span>
              </Label>
              <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center rounded-s-lg border border-zinc-700 bg-zinc-800/50 px-3 text-sm text-zinc-400">
                  docxity.com/
                </span>
                <Input
                  type="text"
                  name="slug"
                  id="slug"
                  className="-ms-px rounded-s-none border-zinc-700 bg-zinc-800/50 text-zinc-100"
                  placeholder="your-slug"
                  disabled={loading}
                  required
                  value={organizationSlug}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (slugRegex.test(value)) {
                      setOrganizationSlug(value);
                      setSlugError(null);
                    } else {
                      setSlugError(
                        "Slug can only contain letters, numbers, and hyphens.",
                      );
                    }
                  }}
                />
              </div>
              {slugError && (
                <span className="text-xs text-red-500">{slugError}</span>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              disabled={loading || !organizationName || !organizationSlug}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Create Organization"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
