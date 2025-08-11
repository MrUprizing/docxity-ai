"use server";

import type { DashboardData } from "@/types/dashboard";
import { auth } from "@clerk/nextjs/server";
import {
  getAutomationPrs,
  getAutomationsByOrgId,
  insertAutomation,
} from "@docxity/database";
import {
  getAllAccessibleRepos,
  getRepoFilesAtBranch,
  getRepositoryBranches,
} from "@docxity/github";
import { app } from "@docxity/github";
import { revalidatePath } from "next/cache";

export async function getInstallations() {
  try {
    // Obtener el octokit autenticado para la app
    const octokit = await app.getInstallationOctokit(1); // Usamos el ID 1 para la app principal

    // Obtener las installations usando la API de GitHub
    const { data } = await octokit.rest.apps.listInstallations();

    return { installations: data };
  } catch (error) {
    console.error("Error fetching installations:", error);
    return { error: "Failed to fetch installations" };
  }
}

export async function createAutomation(
  _prevState: { message: string } | null,
  formData: FormData,
) {
  try {
    const { orgId, userId, orgSlug } = await auth();
    if (!orgId || !userId) {
      return { message: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const installationId = formData.get("installationId") as string;
    const sourceRepo = formData.get("sourceRepo") as string;
    const targetRepo = formData.get("targetRepo") as string;
    const sourceBranch = formData.get("sourceBranch") as string;
    const targetBranch = formData.get("targetBranch") as string;
    const description = formData.get("description") as string;
    const targetFolder = (formData.get("targetFolder") as string) || "docs";

    if (
      !name ||
      !installationId ||
      !sourceRepo ||
      !targetRepo ||
      !sourceBranch ||
      !targetBranch
    ) {
      return { message: "Missing required fields" };
    }

    // Create the automation
    await insertAutomation({
      orgId,
      installationId,
      userId,
      name,
      sourceRepo,
      sourceBranch,
      targetRepo,
      targetBranch,
      targetFolder,
      description,
      active: true,
    });

    // Revalidate the automation list page
    revalidatePath(`/team/${orgSlug}/automation`);

    return { message: "Automation created successfully" };
  } catch (error) {
    console.error("Error creating automation:", error);
    return { message: "Failed to create automation" };
  }
}

export async function getRepositories(installationId: number) {
  try {
    const repos = await getAllAccessibleRepos(installationId);
    return { repos };
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return { error: "Failed to fetch repositories" };
  }
}

export async function getBranches(installationId: number, repo: string) {
  try {
    const [owner, repoName] = repo.split("/");
    const branches = await getRepositoryBranches(
      owner,
      repoName,
      installationId,
    );
    return { branches: branches.map((b) => b.name) };
  } catch (error) {
    console.error("Error fetching branches:", error);
    return { error: "Failed to fetch branches" };
  }
}

export async function getFiles(
  installationId: number,
  repo: string,
  branch: string,
) {
  try {
    const [owner, repoName] = repo.split("/");
    const files = await getRepoFilesAtBranch(
      owner,
      repoName,
      branch,
      installationId,
    );
    return { files };
  } catch (error) {
    console.error("Error fetching files:", error);
    return { error: "Failed to fetch files" };
  }
}

export async function getDashboardData(): Promise<
  DashboardData | { error: string }
> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return { error: "Unauthorized" };
    }

    // Get all automations for the org
    const automations = await getAutomationsByOrgId(orgId);

    // Calculate total docs generated (total PRs created)
    let totalDocsGenerated = 0;
    const allPrs = [];

    // Get PRs for each automation
    for (const automation of automations) {
      const prs = await getAutomationPrs(automation.id);
      totalDocsGenerated += prs.length;

      // Add all PRs to the array with automation info
      for (const pr of prs) {
        allPrs.push({
          id: automation.id,
          name: automation.name || "",
          sourceRepo: automation.sourceRepo,
          targetRepo: automation.targetRepo || "",
          lastPr: {
            ...pr,
            status: pr.status === "completed" ? "completed" : "pending",
          },
        });
      }
    }

    // Sort all PRs by creation date (most recent first)
    allPrs.sort(
      (a, b) =>
        new Date(b.lastPr.createdAt).getTime() -
        new Date(a.lastPr.createdAt).getTime(),
    );

    // Calculate active automations
    const activeAutomations = automations.filter((a) => a.active).length;

    // Calculate success rate (completed PRs / total PRs)
    const successRate =
      totalDocsGenerated > 0
        ? (
            (totalDocsGenerated / (totalDocsGenerated + automations.length)) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      totalDocsGenerated,
      activeAutomations,
      successRate,
      recentAutomations: allPrs.slice(0, 6), // Get last 6 PRs
      totalAutomations: automations.length,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { error: "Failed to fetch dashboard data" };
  }
}
