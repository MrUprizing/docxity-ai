import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

/**
 * Generates technical documentation metadata using the Anthropic model with the provided files content.
 * @param filesContent - The content of the files to analyze
 * @returns The generated documentation metadata including PR title, filename and description
 */
export async function generateRecipeObject(filesContent: string) {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: z.object({
      title: z.string().describe("The title of the pull request"),
      filename: z.string().describe("The name of the markdown file to create"),
      description: z.string().describe("The description of the pull request"),
      content: z.string().describe("The content of the markdown file"),
    }),
    prompt: `Analyze the following code files and generate documentation. For each file:

1. Explain the purpose and functionality of the file
2. Document all functions/components with:
   - Description of what they do
   - Parameters and their types
   - Return values
   - Any important notes or considerations
3. Include code examples where relevant
4. Explain any dependencies or relationships between components

The documentation should be in markdown format with proper headings, code blocks, and formatting.

Files content:
${filesContent}

Generate a PR title that summarizes the changes, a meaningful filename for the documentation, and a detailed PR description that explains what was documented.`,
  });
  return object;
}
