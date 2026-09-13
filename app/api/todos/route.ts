import { initialTodos } from "@/lib/todo-app/types";

/**
 * A read-only JSON API for the Running Example's todos, demonstrating a
 * Route Handler. Not cached (GET Route Handlers are dynamic by default),
 * and independent of the /todos UI route — this is a separate API surface.
 */
export async function GET() {
  return Response.json(initialTodos);
}
