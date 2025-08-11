import { generateRecipeObject } from "@docxity/ai";
import {
  createAutomationPr,
  getAutomationBySourceRepoAndBranch,
  updateAutomationPr,
} from "@docxity/database/src/queries";
import { createMdFileAndPR } from "@docxity/github";
import {
  fetchFilesContent,
  formatFilesContent,
  parseRepoFullName,
} from "./github-utils";

/**
 * Checks if an automation exists for the given repo and branch.
 * Si existe, genera documentación con IA usando el contenido de los archivos creados/modificados del sourceRepo y crea un PR en el targetRepo.
 * @param sourceRepoFullName - The source repository full name (owner/repo).
 * @param sourceBranch - The source branch name.
 * @param installationId - The GitHub App installation ID.
 * @param addedFiles - Array of added file paths.
 * @param modifiedFiles - Array of modified file paths.
 * @param removedFiles - Array of removed file paths.
 * @param commitUrl - URL of the commit that triggered the automation
 */
export async function checkAutomationForPush(
  sourceRepoFullName: string,
  sourceBranch: string,
  installationId: number,
  addedFiles: string[],
  modifiedFiles: string[],
  removedFiles: string[],
  commitUrl: string,
) {
  const automation = await getAutomationBySourceRepoAndBranch(
    sourceRepoFullName,
    sourceBranch,
  );
  if (!automation) {
    return;
  }
  console.log("automation created");

  // Source repo info
  const { owner: sourceOwner, repo: sourceRepo } =
    parseRepoFullName(sourceRepoFullName);

  // Target repo info (donde se creará el archivo y el PR)
  const targetRepoFullName = automation.targetRepo || sourceRepoFullName;
  const targetBranch = automation.targetBranch || sourceBranch;
  const targetFolder = automation.targetFolder || "docs";
  const { owner: targetOwner, repo: targetRepo } =
    parseRepoFullName(targetRepoFullName);

  // Solo archivos creados y modificados
  const filesToFetch = [...addedFiles, ...modifiedFiles];

  // Obtener contenido de cada archivo desde el sourceRepo/sourceBranch
  const filesWithContent = await fetchFilesContent(
    sourceOwner,
    sourceRepo,
    sourceBranch,
    installationId,
    filesToFetch,
    removedFiles,
  );

  // Formatear el contenido de los archivos para el modelo de IA
  const filesContent = formatFilesContent(filesWithContent);

  // Generar documentación con IA usando el contenido de los archivos
  const { title, filename, description, content } =
    await generateRecipeObject(filesContent);

  try {
    // Crear registro inicial en la base de datos
    const prRecord = await createAutomationPr({
      sourceRepo: sourceRepoFullName,
      sourceBranch,
      targetRepo: targetRepoFullName,
      targetBranch,
      automationId: automation.id,
    });

    // Crear el archivo markdown y el PR en el targetRepo/targetBranch
    const pr = await createMdFileAndPR(
      targetOwner,
      targetRepo,
      targetBranch,
      installationId,
      `${targetFolder}/${filename}`,
      content,
      title,
      description,
    );

    // Actualizar el registro con la información de la PR
    if (pr?.data?.html_url) {
      await updateAutomationPr(prRecord.id, {
        commitUrl,
        prUrl: pr.data.html_url,
        prTitle: title,
        prDescription: description,
      });
    } else {
      throw new Error("Failed to create PR: No PR URL returned");
    }
  } catch (error) {
    console.error("Error creating PR or saving to database:", error);
    throw error;
  }
}
