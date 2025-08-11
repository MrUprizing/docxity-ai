import { App } from "octokit";

const app = new App({
  appId: process.env.GITHUB_APP_ID as string,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
  webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET as string },
});

app.webhooks.on("issues.opened", ({ octokit, payload }) => {
  return octokit.rest.issues.createComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.issue.number,
    body: "Hello, World!",
  });
});
