"use client";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizationList } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Regex to allow only letters, numbers, and hyphens for the slug
const slugRegex = /^[a-z0-9-]*$/;

export function DialogCreateOrganization() {
  const { isLoaded, createOrganization } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const router = useRouter();

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validate slug
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
      await createOrganization({
        name: organizationName,
        slug: organizationSlug,
      });
      // Reset form after successful creation
      setOrganizationName("");
      setOrganizationSlug("");
      // Show success toast
      toast.success("Organization created", {
        description: `${organizationName} has been created successfully.`,
      });
      // Revalidate the current path and redirect
      router.refresh();
      router.push(`/team/${organizationSlug}`);
    } catch (err) {
      // Show error toast
      toast.error("Error", {
        description: "Failed to create organization. Please try again.",
      });
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Organization</DialogTitle>
        <DialogDescription>
          Enter the details for your new team below.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name of Organization <span className="text-red-500">*</span>
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">
            Slug Organization <span className="text-red-500">*</span>
          </Label>
          <div className="flex rounded-lg shadow-sm shadow-black/5">
            <span className="inline-flex items-center rounded-s-lg border border-input bg-card px-3 text-sm text-muted-foreground">
              docxity.com/
            </span>
            <Input
              type="text"
              name="slug"
              id="slug"
              className="-ms-px rounded-s-none shadow-none"
              placeholder="your-slug"
              disabled={loading}
              required
              value={organizationSlug}
              onChange={(e) => {
                // Only allow valid slug characters
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
        <DialogFooter className="flex justify-between items-center">
          <div className="flex-1 flex justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </div>
          <div className="flex-1 flex justify-end">
            <Button
              type="submit"
              disabled={loading || !organizationName || !organizationSlug}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
