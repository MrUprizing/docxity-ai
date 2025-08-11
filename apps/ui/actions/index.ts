"use server";

import { auth } from "@clerk/nextjs/server";
import { insertAutomation } from "@docxity/database/src/queries";
import { revalidatePath } from "next/cache";

interface ActionState {
  message: string;
}

export async function createAutomation(
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Parse form data
  const name = formData.get("name") as string | null;
  const installationId = formData.get("installationId") as string;
  const sourceRepo = formData.get("sourceRepo") as string;
  const targetRepo = formData.get("targetRepo") as string | null;

  const { userId, orgId, orgSlug } = await auth();

  // const sourceBranch = formData.get("sourceBranch") as string;
  // const eventType = formData.get("eventType") as string | null;
  // const targetBranch = formData.get("targetBranch") as string | null;
  // const active =
  //   formData.get("active") === "on" || formData.get("active") === "true";
  // const description = formData.get("description") as string | null;

  if (
    !orgId ||
    !installationId ||
    !userId ||
    !sourceRepo ||
    !name ||
    !targetRepo
  ) {
    return { message: "Missing required fields" };
  }

  try {
    await insertAutomation({
      orgId,
      installationId,
      userId,
      // eventType,
      name,
      sourceRepo,
      // sourceBranch,
      targetRepo,
      // targetBranch,
      // active,
      // description,
    });
    revalidatePath(`/team/${orgSlug}/automations`);
    return { message: "Automation created successfully" };
  } catch {
    return { message: "Error creating automation" };
  }
}
