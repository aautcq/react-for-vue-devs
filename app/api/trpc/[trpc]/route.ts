import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { todoRouter } from "@/lib/trpc/router";

/**
 * Serves the whole tRPC router from one Route Handler, via the fetch
 * adapter — the same Web Request/Response contract every other Route
 * Handler in this app uses. See the Fetch Adapter Route Handler lesson.
 */
function handler(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: todoRouter,
  });
}

export { handler as GET, handler as POST };
