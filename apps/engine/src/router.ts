import { createIssue } from "@docxity/github";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { githubCallback } from "./services/callbacks/github-callback";
import { clerkWebhook } from "./services/webhooks/clerk-webhook";
import { githubWebhook } from "./services/webhooks/github-webhook";

const router = new Hono();
router.use(logger());

router.get("/", (c) => c.text("Hello Hono!"));
router.post("/api/v1/webhook/github", githubWebhook);
router.post("/api/v1/webhook/clerk", clerkWebhook);
router.get("/api/v1/callback/github", githubCallback);

router.post("/create-issue", async (c) => {
  const { owner, repo, title, body, installationId } = await c.req.json();
  const response = await createIssue(owner, repo, title, body, installationId);
  return c.json({ success: true, issue: response.data });
});

export default router;
