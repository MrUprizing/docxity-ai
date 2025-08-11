import { App } from "octokit";

// Initialize the GitHub App instance with environment variables
export const app = new App({
  appId: process.env.GITHUB_APP_ID as string,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
  webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET as string },
});

export * from "./queries";
