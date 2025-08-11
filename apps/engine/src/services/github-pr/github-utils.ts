import { getFileContentFromRepo } from "@docxity/github";
import type { FileChange } from "./types";

/**
 * Fetches content for multiple files from a GitHub repository.
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param branch - Branch name
 * @param installationId - GitHub App installation ID
 * @param files - Array of file paths to fetch
 * @param removedFiles - Array of removed file paths
 * @returns Array of file changes with their content
 */
export async function fetchFilesContent(
  owner: string,
  repo: string,
  branch: string,
  installationId: number,
  files: string[],
  removedFiles: string[],
): Promise<FileChange[]> {
  return Promise.all(
    files.map(async (file) => {
      try {
        const content = await getFileContentFromRepo(
          owner,
          repo,
          file,
          branch,
          installationId,
        );
        return { file, content };
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (e: any) {
        if (removedFiles.includes(file)) {
          return { file, content: "[Archivo eliminado en este push]" };
        }
        return { file, content: `[Error fetching content: ${e.message}]` };
      }
    }),
  );
}

/**
 * Extracts repository information from a full repository name.
 * @param repoFullName - Full repository name (owner/repo)
 * @returns Object containing owner and repo name
 */
export function parseRepoFullName(repoFullName: string) {
  const [owner, repo] = repoFullName.split("/");
  return { owner, repo };
}

/**
 * Formats file changes into a structured text for AI processing.
 * @param filesWithContent - Array of file changes
 * @returns Formatted text containing all file contents
 */
export function formatFilesContent(filesWithContent: FileChange[]): string {
  return filesWithContent
    .map(({ file, content }) => `Archivo: ${file}\nContenido:\n${content}\n`)
    .join("\n---\n");
}
