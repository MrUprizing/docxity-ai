import { app } from "./index";

/**
 * Creates an issue in a GitHub repository as the App installation.
 * @param owner Repository owner (user or organization)
 * @param repo Repository name
 * @param title Issue title
 * @param body Issue body/message
 * @param installationId Installation ID as a number
 * @returns The created issue response from GitHub API
 */
export async function createIssue(
  owner: string,
  repo: string,
  title: string,
  body: string,
  installationId: number,
) {
  // Get an authenticated Octokit instance for this installation
  const octokit = await app.getInstallationOctokit(installationId);
  // Use octokit to create the issue
  return octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
  });
}
