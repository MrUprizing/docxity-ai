"use client";

import { createAutomation, getBranches } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

type DialogCreateProps = {
  connections: { installationId: number; accountSlug: string }[];
  reposByConnection: Record<
    number,
    { id: number; name: string; full_name: string }[]
  >;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm" className="min-w-[80px]">
      {pending ? "Creating..." : "Create"}
    </Button>
  );
}

export default function DialogCreate({
  connections,
  reposByConnection,
}: DialogCreateProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedSourceRepo, setSelectedSourceRepo] = useState<string>("");
  const [selectedTargetRepo, setSelectedTargetRepo] = useState<string>("");
  const [sourceBranches, setSourceBranches] = useState<string[]>([]);
  const [targetBranches, setTargetBranches] = useState<string[]>([]);
  const [selectedSourceBranch, setSelectedSourceBranch] = useState<string>("");
  const [selectedTargetBranch, setSelectedTargetBranch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Always ensure repos is an array
  const repos = Array.isArray(reposByConnection?.[Number(selectedAccount)])
    ? reposByConnection[Number(selectedAccount)]
    : [];

  const [state, formAction] = useActionState(createAutomation, { message: "" });

  useEffect(() => {
    if (!state?.message) return;
    if (state.message === "Automation created successfully") {
      toast.success(state.message);
      if (formRef.current) {
        formRef.current.reset();
        setSelectedAccount("");
        setSelectedSourceRepo("");
        setSelectedTargetRepo("");
        setSelectedSourceBranch("");
        setSelectedTargetBranch("");
        setSourceBranches([]);
        setTargetBranches([]);
      }
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state?.message]);

  // Handle source repo selection
  const handleSourceRepoChange = async (value: string) => {
    setSelectedSourceRepo(value);
    setSelectedSourceBranch("");
    setSourceBranches([]);

    if (value && selectedAccount) {
      setIsLoading(true);
      try {
        const result = await getBranches(Number(selectedAccount), value);
        if (result.branches) {
          setSourceBranches(result.branches);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle target repo selection
  const handleTargetRepoChange = async (value: string) => {
    setSelectedTargetRepo(value);
    setSelectedTargetBranch("");
    setTargetBranches([]);

    if (value && selectedAccount) {
      setIsLoading(true);
      try {
        const result = await getBranches(Number(selectedAccount), value);
        if (result.branches) {
          setTargetBranches(result.branches);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 " />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Create Automation
          </DialogTitle>
          <DialogDescription className="text-sm">
            Set up a new automation to sync content between repositories.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="grid gap-4">
            {/* Basic Information */}
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter automation name"
                    required
                    className="h-8"
                    maxLength={128}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    placeholder="Enter automation description"
                    className="h-8"
                    maxLength={512}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">GitHub Account</Label>
                <Select
                  value={selectedAccount}
                  onValueChange={(value) => {
                    setSelectedAccount(value);
                    setSelectedSourceRepo("");
                    setSelectedTargetRepo("");
                    setSelectedSourceBranch("");
                    setSelectedTargetBranch("");
                    setSourceBranches([]);
                    setTargetBranches([]);
                  }}
                  required
                  name="installationId"
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select GitHub account" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((account) => (
                      <SelectItem
                        key={account.installationId}
                        value={String(account.installationId)}
                      >
                        {account.accountSlug}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Repository Configuration */}
            <div className="grid gap-3">
              {/* Source Repository */}
              <div className="rounded-lg border p-3 bg-sidebar">
                <h4 className="text-sm font-medium mb-2">Source Repository</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Repository</Label>
                    <Select
                      value={selectedSourceRepo}
                      onValueChange={handleSourceRepoChange}
                      disabled={!selectedAccount || isLoading}
                      required
                      name="sourceRepo"
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select source repository" />
                      </SelectTrigger>
                      <SelectContent>
                        {repos.map((repo) => (
                          <SelectItem key={repo.id} value={repo.full_name}>
                            {repo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Branch</Label>
                    <Select
                      value={selectedSourceBranch}
                      onValueChange={setSelectedSourceBranch}
                      disabled={!selectedSourceRepo || isLoading}
                      required
                      name="sourceBranch"
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select source branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceBranches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Target Repository */}
              <div className="rounded-lg border p-3 bg-sidebar">
                <h4 className="text-sm font-medium mb-2">Target Repository</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Repository</Label>
                    <Select
                      value={selectedTargetRepo}
                      onValueChange={handleTargetRepoChange}
                      disabled={!selectedAccount || isLoading}
                      required
                      name="targetRepo"
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select target repository" />
                      </SelectTrigger>
                      <SelectContent>
                        {repos.map((repo) => (
                          <SelectItem key={repo.id} value={repo.full_name}>
                            {repo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Branch</Label>
                    <Select
                      value={selectedTargetBranch}
                      onValueChange={setSelectedTargetBranch}
                      disabled={!selectedTargetRepo || isLoading}
                      required
                      name="targetBranch"
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select target branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetBranches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <Label htmlFor="targetFolder" className="text-sm font-medium">
                    Target Folder
                  </Label>
                  <Input
                    id="targetFolder"
                    name="targetFolder"
                    type="text"
                    placeholder="docs"
                    defaultValue="docs"
                    className="h-8"
                    maxLength={255}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-w-[80px]"
              >
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
