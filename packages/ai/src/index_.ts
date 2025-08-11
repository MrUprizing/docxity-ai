import { perplexity } from "@ai-sdk/perplexity";
import { generateText } from "ai";

/**
 * Generates text using the Perplexity model with the provided prompt.
 * @param prompt - The data to send to the model.
 * @returns The generated text.
 */
export async function generatePerplexityText(data: string): Promise<string> {
  const { text } = await generateText({
    model: perplexity("sonar"),
    prompt: `You are a documentation assistant, generated documentation about this: ${data}`,
  });
  return text;
}
