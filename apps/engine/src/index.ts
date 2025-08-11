import { serve } from "@hono/node-server";
import router from "./router";

serve({
  fetch: router.fetch,
  port: 4000,
});
