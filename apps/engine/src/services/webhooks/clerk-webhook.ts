import {
  insertOrganizationByClerkId,
  insertUserByClerkId,
} from "@docxity/database";
import type { Context } from "hono";

export const clerkWebhook = async (c: Context) => {
  const payload = await c.req.json();
  const eventType = payload.type;
  const data = payload.data;

  if (eventType === "user.created") {
    await insertUserByClerkId(data.id);
    console.log("Clerk webhook user ID received!");
    return c.text("Clerk webhook user ID received!");
  }

  if (eventType === "organization.created") {
    await insertOrganizationByClerkId(data.id);
    console.log("Clerk webhook organization ID received!");
    return c.text("Clerk webhook organization ID received!");
  }

  console.log("Received Clerk event with unknown type", eventType);
  return c.text("Clerk webhook received!");
};
