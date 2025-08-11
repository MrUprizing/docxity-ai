import { app } from "./index";

/**
 * Gets information about a GitHub App installation, including accessible repositories and account details.
 * @param installationId Installation ID as a number
 * @returns Object containing installation info, account (user/org), and repositories
 */
export async function getInstallationInfo(installationId: number) {
  // Get an authenticated Octokit instance for this installation
  const octokit = await app.getInstallationOctokit(installationId);

  // Get installation details (includes account info)
  const installation = await octokit.rest.apps.getInstallation({
    installation_id: installationId,
  });
  // Get repositories accessible by this installation
  // const repos = await octokit.rest.apps.listReposAccessibleToInstallation({
  //   installation_id: installationId,
  //   per_page: 100, // You can paginate if needed
  // });

  // Return relevant info: installation, account, and repositories
  return {
    installation: installation.data,
    account: installation.data.account,
    // repositories: repos.data.repositories,
  };
}

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

/**
 * Gets all repositories accessible to a GitHub App installation using Octokit's auto-pagination.
 * @param installationId Installation ID as a number
 * @returns Array of repositories accessible to the installation
 */
export async function getAllAccessibleRepos(installationId: number) {
  // Get an authenticated Octokit instance for this installation
  const octokit = await app.getInstallationOctokit(installationId);

  // Use Octokit's paginate method to fetch all repositories automatically
  const repos = await octokit.paginate(
    octokit.rest.apps.listReposAccessibleToInstallation,
    {
      installation_id: installationId,
      per_page: 100,
    },
  );

  return repos;
}

/**
 * Gets all branches for a specific repository accessible to a GitHub App installation.
 * @param owner Repository owner (user or organization)
 * @param repo Repository name
 * @param installationId Installation ID as a number
 * @returns Array of branches in the repository
 */
export async function getRepositoryBranches(
  owner: string,
  repo: string,
  installationId: number,
) {
  // Get an authenticated Octokit instance for this installation
  const octokit = await app.getInstallationOctokit(installationId);

  // Use Octokit pagination to fetch all branches for the repository
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const branches: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await octokit.rest.repos.listBranches({
      owner,
      repo,
      per_page: 100,
      page,
    });
    branches.push(...response.data);
    hasMore = response.data.length === 100;
    page += 1;
  }

  return branches;
}

/**
 * Gets the file tree of a repository at a specific branch as a plain JSON array.
 * @param owner Repository owner (user or organization)
 * @param repo Repository name
 * @param branch Branch name (defaults to 'main')
 * @param installationId Installation ID as a number
 * @returns Array of files and directories with their path and type
 */
export async function getRepoFilesAtBranch(
  owner: string,
  repo: string,
  branch: string,
  installationId: number,
) {
  // Get an authenticated Octokit instance for this installation
  const octokit = await app.getInstallationOctokit(installationId);

  // Get the reference (commit SHA) for the branch
  const refData = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });

  const commitSha = refData.data.object.sha;

  // Get the tree recursively from the commit SHA
  const treeData = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: commitSha,
    recursive: "true",
  });

  // Map the tree to a simple JSON array
  return treeData.data.tree.map((item) => ({
    path: item.path,
    type: item.type, // 'blob' (file) or 'tree' (directory)
  }));
}

/**
 * Creates a .md file with given content in a new branch and opens a PR to the target branch.
 * @param owner Repository owner (user or org)
 * @param repo Repository name
 * @param targetBranch Target branch to base the new branch and PR
 * @param installationId Installation ID as a number
 * @param filePath Path for the new .md file (e.g., docs/newfile.md)
 * @param fileContent Content for the .md file
 * @param prTitle Title for the Pull Request
 * @param prBody Body/description for the Pull Request
 * @returns The created PR response from GitHub API
 */
export async function createMdFileAndPR(
  owner: string,
  repo: string,
  targetBranch: string,
  installationId: number,
  filePath: string,
  fileContent: string,
  prTitle: string,
  prBody: string,
) {
  // Get an authenticated Octokit instance for this installation
  const octokit = await app.getInstallationOctokit(installationId);

  // 1. Get the latest commit SHA of the target branch
  const refData = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${targetBranch}`,
  });
  const baseSha = refData.data.object.sha;

  // 2. Create a new branch from the target branch
  const branchName = `feature/add-md-file-${Date.now()}`;
  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  // 3. Create the .md file in the new branch
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Add ${filePath}`,
    content: Buffer.from(fileContent).toString("base64"),
    branch: branchName,
  });

  // 4. Create a Pull Request from the new branch to the target branch
  const pr = await octokit.rest.pulls.create({
    owner,
    repo,
    title: prTitle,
    head: branchName,
    base: targetBranch,
    body: prBody,
  });

  return pr;
}

export async function getFileContentFromRepo(
  owner: string,
  repo: string,
  path: string,
  ref: string,
  installationId: number,
): Promise<string> {
  const octokit = await app.getInstallationOctokit(installationId);
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    ref,
  });
  // @ts-ignore
  return Buffer.from(data.content, "base64").toString("utf-8");
}
