import { getUserByClerkId, insertGithubInstallation } from "@docxity/database";
import { getInstallationInfo } from "@docxity/github";
import { verifyJwt } from "@docxity/utils";
import type { Context } from "hono";

export const githubCallback = async (c: Context) => {
  const state = c.req.query("state");
  const installation_id = c.req.query("installation_id");

  if (!installation_id || !state) {
    throw new Error("Missing installationId or state");
  }

  try {
    const decoded = verifyJwt(state) as {
      orgSlug: string;
      userId: string;
      orgId: string;
    };

    // Find the user by Clerk user ID
    const user = await getUserByClerkId(decoded.userId);
    if (!user) {
      return c.text("User not found", 404);
    }

    // Get installation info from GitHub
    const installationInfo = await getInstallationInfo(Number(installation_id));
    const installation = installationInfo.installation;
    const account = installation.account as {
      type?: string;
      name?: string;
      login?: string;
    };

    // Determine account type and slug
    const accountType = account.type ?? "Organization";
    const accountSlug = account.name ?? account.login ?? "";

    if (installation.id !== Number(installation_id)) {
      return c.text("Installation incorrect", 404);
    }

    // Insert GitHub installation into the database
    await insertGithubInstallation({
      installationId: installation_id,
      accountSlug: accountSlug,
      installedByUserId: user.clerkUserId,
      installedOnOrgId: decoded.orgId,
      installedOnType: accountType,
    });

    return c.redirect(`http://localhost:3000/team/${decoded.orgSlug}`);
  } catch (error) {
    console.error("Invalid JWT in state parameter:", error);
    return c.text("Invalid or expired state parameter", 400);
  }
};
