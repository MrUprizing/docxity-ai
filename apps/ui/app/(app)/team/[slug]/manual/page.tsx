"use client";

import { getBranches, getInstallations, getRepositories } from "@/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Installation {
  id: number;
  account: {
    login: string;
  };
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
}

export default function Page() {
  const [selectedInstallation, setSelectedInstallation] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // States for fetched data
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch installations on mount
  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const result = await getInstallations();
        if (result.installations) {
          const transformedInstallations = result.installations.map((inst) => ({
            id: inst.id,
            account: {
              login: inst.account?.login || "",
            },
          }));
          setInstallations(transformedInstallations);
        }
      } catch (error) {
        console.error("Error fetching installations:", error);
      }
    };
    fetchInstallations();
  }, []);

  // Handle installation selection
  const handleInstallationChange = async (value: string) => {
    setSelectedInstallation(value);
    setSelectedRepo("");
    setSelectedBranch("");
    setRepos([]);
    setBranches([]);

    if (value) {
      setIsLoading(true);
      try {
        const result = await getRepositories(Number(value));
        if (result.repos) {
          setRepos(result.repos);
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle repository selection
  const handleRepoChange = async (value: string) => {
    setSelectedRepo(value);
    setSelectedBranch("");
    setBranches([]);

    if (value && selectedInstallation) {
      setIsLoading(true);
      try {
        const result = await getBranches(Number(selectedInstallation), value);
        if (result.branches) {
          setBranches(result.branches);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle branch selection
  const handleBranchChange = async (value: string) => {
    setSelectedBranch(value);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <label htmlFor="installation-select">Select Installation</label>
        <Select
          value={selectedInstallation}
          onValueChange={handleInstallationChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select installation" />
          </SelectTrigger>
          <SelectContent>
            {installations.map((installation) => (
              <SelectItem key={installation.id} value={String(installation.id)}>
                {installation.account.login}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="repo-select">Select Repository</label>
        <Select
          value={selectedRepo}
          onValueChange={handleRepoChange}
          disabled={!selectedInstallation || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select repository" />
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

      <div className="space-y-2">
        <label htmlFor="branch-select">Select Branch</label>
        <Select
          value={selectedBranch}
          onValueChange={handleBranchChange}
          disabled={!selectedRepo || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
