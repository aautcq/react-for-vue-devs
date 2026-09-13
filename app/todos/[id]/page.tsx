import Link from "next/link";
import { notFound } from "next/navigation";
import { getTodo } from "@/lib/todo-app/server-store";

/**
 * The Running Example's per-todo detail route: app/todos/[id]/page.tsx.
 * Uses the `PageProps<'/todos/[id]'>` global typed-props helper (no import
 * needed) to type `params` — see the Routing, Layouts & Pages lesson.
 */
export default async function TodoDetailPage(props: PageProps<"/todos/[id]">) {
  const { id } = await props.params;
  const todo = await getTodo(id);

  if (!todo) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link href="/todos" className="text-sm hover:underline">
        ← Back to todos
      </Link>
      <h1 className="mt-4 mb-2 text-2xl font-semibold tracking-tight">{todo.text}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Status: {todo.done ? "Done" : "Not done"}
      </p>
    </div>
  );
}
