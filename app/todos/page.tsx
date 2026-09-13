import Link from "next/link";
import { getTodos } from "@/lib/todo-app/server-store";
import { toggleTodoAction, deleteTodoAction } from "@/lib/todo-app/actions";
import { AddTodoForm } from "./AddTodoForm";

/**
 * The Running Example's real feature route (not a lesson): a Server
 * Component that fetches todos with `async`/`await` directly (Fetching
 * Data lesson) and mutates them via Server Actions (Mutating Data lesson).
 * Note this lives at app/todos, outside the (lessons) route group.
 */
export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Todos</h1>
      <AddTodoForm />
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
          >
            <Link href={`/todos/${todo.id}`} className="flex-1 hover:underline">
              <span className={todo.done ? "text-zinc-400 line-through" : ""}>{todo.text}</span>
            </Link>
            <form action={toggleTodoAction}>
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                className="rounded-full border border-black/[.08] px-2 py-0.5 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
              >
                {todo.done ? "Undo" : "Done"}
              </button>
            </form>
            <form action={deleteTodoAction}>
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                className="rounded-full border border-black/[.08] px-2 py-0.5 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
