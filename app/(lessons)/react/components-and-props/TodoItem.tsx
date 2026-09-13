import type { Todo } from "@/lib/todo-app/types";

/**
 * Presentational component: renders one Todo. No state of its own yet —
 * it just displays whatever `todo` it's handed. Interactivity comes in
 * later lessons.
 */
export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2 dark:border-white/[.145]">
      <input type="checkbox" checked={todo.done} readOnly className="h-4 w-4" />
      <span className={todo.done ? "text-zinc-400 line-through" : ""}>{todo.text}</span>
    </li>
  );
}
