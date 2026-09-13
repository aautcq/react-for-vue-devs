import { z } from "zod";
import { addTodo, deleteTodo, getTodos, toggleTodo } from "@/lib/todo-app/server-store";

/**
 * A JSON API for the Running Example's todos, demonstrating a Route
 * Handler (see the Route Handlers lesson). Not cached (GET Route Handlers
 * are dynamic by default), and independent of the /todos UI route — this
 * is a separate API surface, one that reads/writes the same underlying
 * server-store as the Server Actions in lib/todo-app/actions.ts.
 *
 * Also backs the TanStack Query Track's client-fetching Demo (GET/POST/
 * PATCH/DELETE), and is superseded by the typed tRPC router in the tRPC
 * Track — same job, done with end-to-end types instead of hand-rolled
 * fetch calls. Validated with the same zod rules as that router's
 * procedures, so a malformed request here can't corrupt the shared
 * in-memory store every other Track's Demo reads from.
 */
const addBody = z.object({ text: z.string().min(1, "Todo text can't be empty.") });
const idBody = z.object({ id: z.string().min(1) });

async function parseJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export async function GET() {
  return Response.json(await getTodos());
}

export async function POST(request: Request) {
  const parsed = addBody.safeParse(await parseJson(request));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const todo = await addTodo(parsed.data.text);
  return Response.json(todo, { status: 201 });
}

export async function PATCH(request: Request) {
  const parsed = idBody.safeParse(await parseJson(request));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  await toggleTodo(parsed.data.id);
  return new Response(null, { status: 204 });
}

export async function DELETE(request: Request) {
  const parsed = idBody.safeParse(await parseJson(request));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  await deleteTodo(parsed.data.id);
  return new Response(null, { status: 204 });
}
