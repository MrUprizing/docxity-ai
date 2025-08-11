import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./db";
import {
  automationPrs,
  automations,
  githubInstallations,
  organizations,
  users,
} from "./schema";

/**
 * Insert a new user with the given clerkUserId.
 * @param clerkUserId - The Clerk user ID to insert.
 * @returns The inserted user record.
 */
export async function insertUserByClerkId(clerkUserId: string) {
  const [user] = await db.insert(users).values({ clerkUserId }).returning();
  return user;
}

/**
 * Insert a new organization with the given clerkOrgId.
 * @param clerkOrgId - The Clerk organization ID to insert.
 * @returns The inserted organization record.
 */
export async function insertOrganizationByClerkId(clerkOrgId: string) {
  const [organization] = await db
    .insert(organizations)
    .values({ clerkOrgId })
    .returning();
  return organization;
}

/**
 * Insert a new GitHub installation record.
 * @param installation - Object containing installation data.
 * @returns The inserted GitHub installation record.
 */
export async function insertGithubInstallation(installation: {
  installationId: string;
  accountSlug: string | null | undefined;
  installedByUserId: string; // User who installed
  installedOnOrgId: string; // Organization where installed
  installedOnType: string;
}) {
  const [record] = await db
    .insert(githubInstallations)
    .values({
      installationId: installation.installationId,
      accountSlug: installation.accountSlug,
      installedByUserId: installation.installedByUserId,
      installedOnOrgId: installation.installedOnOrgId,
      installedOnType: installation.installedOnType,
    })
    .returning();
  return record;
}

/**
 * Find a user by Clerk user ID.
 * @param clerkUserId - The Clerk user ID.
 * @returns The user record or undefined if not found.
 */
export async function getUserByClerkId(clerkUserId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId));
  return user;
}

/**
 * Get all GitHub installations for a given organization.
 * @param orgId - The Clerk organization ID.
 * @returns Array of objects with installationId and accountSlug.
 */
export async function getGithubInstallationsByOrgId(orgId: string) {
  const installations = await db
    .select({
      installationId: githubInstallations.installationId,
      accountSlug: githubInstallations.accountSlug,
    })
    .from(githubInstallations)
    .where(eq(githubInstallations.installedOnOrgId, orgId));
  return installations;
}

/**
 * Insert a new automation record.
 * @param automation - Object containing automation data.
 * @returns The inserted automation record.
 */
export async function insertAutomation(automation: {
  orgId: string;
  installationId: string;
  userId: string;
  eventType?: string | null;
  name?: string | null;
  sourceRepo: string;
  sourceBranch?: string;
  targetRepo?: string | null;
  targetBranch?: string;
  targetFolder?: string;
  active?: boolean;
  conditions?: unknown;
  description?: string | null;
}) {
  const [record] = await db
    .insert(automations)
    .values({
      id: nanoid(12),
      orgId: automation.orgId,
      installationId: automation.installationId,
      userId: automation.userId,
      eventType: automation.eventType ?? null,
      name: automation.name ?? null,
      sourceRepo: automation.sourceRepo,
      sourceBranch: automation.sourceBranch,
      targetRepo: automation.targetRepo ?? null,
      targetBranch: automation.targetBranch,
      targetFolder: automation.targetFolder ?? "docs",
      active: automation.active ?? false,
      description: automation.description ?? null,
    })
    .returning();
  return record;
}

/**
 * Get all automations for a given organization.
 * @param orgId - The Clerk organization ID.
 * @returns Array of automation records.
 */
export async function getAutomationsByOrgId(orgId: string) {
  // Fetch all automations where orgId matches the provided value
  const automationsList = await db
    .select()
    .from(automations)
    .where(eq(automations.orgId, orgId));
  return automationsList;
}

/**
 * Get a single automation by its ID.
 * @param automationId - The automation ID.
 * @returns The automation record or undefined if not found.
 */
export async function getAutomationById(automationId: string) {
  const [automation] = await db
    .select()
    .from(automations)
    .where(eq(automations.id, automationId));
  return automation;
}

/**
 * Find an automation by sourceRepo and sourceBranch.
 * @param sourceRepo - The source repository name.
 * @param sourceBranch - The source branch name.
 * @returns The automation record or undefined if not found.
 */
export async function getAutomationBySourceRepoAndBranch(
  sourceRepo: string,
  sourceBranch: string,
) {
  const [automation] = await db
    .select()
    .from(automations)
    .where(
      and(
        eq(automations.sourceRepo, sourceRepo),
        eq(automations.sourceBranch, sourceBranch),
      ),
    );
  return automation;
}

/**
 * Creates a new record for an automated PR.
 * @param data - The PR data to store
 * @returns The created PR record
 */
export async function createAutomationPr(data: {
  sourceRepo: string;
  sourceBranch: string;
  targetRepo: string;
  targetBranch: string;
  automationId: string;
  commitUrl?: string;
  prUrl?: string;
  prTitle?: string;
  prDescription?: string;
}) {
  const [pr] = await db
    .insert(automationPrs)
    .values({
      ...data,
      status: "pending",
    })
    .returning();
  return pr;
}

/**
 * Updates an existing PR record with the final PR information.
 * @param id - The ID of the PR record
 * @param data - The PR data to update
 * @returns The updated PR record
 */
export async function updateAutomationPr(
  id: number,
  data: {
    commitUrl: string;
    prUrl: string;
    prTitle: string;
    prDescription: string;
  },
) {
  const [pr] = await db
    .update(automationPrs)
    .set({
      ...data,
      status: "completed",
      updatedAt: new Date(),
    })
    .where(eq(automationPrs.id, id))
    .returning();
  return pr;
}

/**
 * Gets all automated PRs for a specific automation.
 * @param automationId - The ID of the automation
 * @returns Array of PR records
 */
export async function getAutomationPrs(automationId: string) {
  return db
    .select()
    .from(automationPrs)
    .where(eq(automationPrs.automationId, automationId))
    .orderBy(desc(automationPrs.createdAt));
}

/**
 * Gets the latest automated PR for a specific automation.
 * @param automationId - The ID of the automation
 * @returns The latest PR record or null if none exists
 */
export async function getLatestAutomationPr(automationId: string) {
  const [pr] = await db
    .select()
    .from(automationPrs)
    .where(eq(automationPrs.automationId, automationId))
    .orderBy(desc(automationPrs.createdAt))
    .limit(1);
  return pr;
}
