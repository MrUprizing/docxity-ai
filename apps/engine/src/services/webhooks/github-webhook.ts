import type { Context } from "hono";
import { checkAutomationForPush } from "../github-pr/automation";
import type {
  PullRequestEventPayload,
  PushEventPayload,
} from "../github-pr/types";

/**
 * Handles GitHub webhook events.
 * @param c - Hono context
 * @returns Response text
 */
export const githubWebhook = async (c: Context) => {
  const payload = await c.req.json();
  const eventType = c.req.header("x-github-event");

  if (eventType === "push") {
    return handlePushEvent(c, payload as PushEventPayload);
  }

  if (eventType === "pull_request") {
    return handlePullRequestEvent(c, payload as PullRequestEventPayload);
  }

  console.log("Event type:", eventType);
  return c.text("GitHub webhook received!");
};

/**
 * Handles push events from GitHub.
 * @param c - Hono context
 * @param payload - Push event payload
 * @returns Response text
 */
async function handlePushEvent(c: Context, payload: PushEventPayload) {
  const repo = payload.repository?.full_name;
  const branch = payload.ref?.replace("refs/heads/", "");
  const installationId = payload.installation?.id;
  const commitUrl = payload.head_commit?.url;

  if (!repo || !branch || !installationId) {
    console.log("Missing required data in payload");
    return c.text("Push event processed with missing data", 400);
  }

  if (!commitUrl) {
    console.log("Missing commit URL in payload");
    return c.text("Push event processed with missing commit URL", 400);
  }

  // Extract file changes from commits
  const addedFiles = payload.commits?.flatMap((c) => c.added || []) ?? [];
  const modifiedFiles = payload.commits?.flatMap((c) => c.modified || []) ?? [];
  const removedFiles = payload.commits?.flatMap((c) => c.removed || []) ?? [];

  try {
    await checkAutomationForPush(
      repo,
      branch,
      installationId,
      addedFiles,
      modifiedFiles,
      removedFiles,
      commitUrl,
    );
    return c.text("Push event processed successfully!");
  } catch (error) {
    console.error("Error processing push event:", error);
    return c.text("Error processing push event", 500);
  }
}

/**
 * Handles pull request events from GitHub.
 * @param c - Hono context
 * @param payload - Pull request event payload
 * @returns Response text
 */
function handlePullRequestEvent(c: Context, payload: PullRequestEventPayload) {
  console.log("Event action:", payload.action);
  console.log("Event pull request:", payload.pull_request);
  return c.text("Pull request event received!");
}
