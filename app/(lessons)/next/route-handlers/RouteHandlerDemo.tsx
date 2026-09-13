"use client";

import { useState } from "react";
import type { Todo } from "@/lib/todo-app/types";

/**
 * Fetches the real /api/todos Route Handler on click, to prove it's a
 * working JSON endpoint rather than a hypothetical.
 */
export function RouteHandlerDemo() {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchTodos() {
    setLoading(true);
    const res = await fetch("/api/todos");
    const data = (await res.json()) as Todo[];
    setTodos(data);
    setLoading(false);
  }

  return (
    <div className="space-y-3 text-sm">
      <button
        type="button"
        onClick={fetchTodos}
        disabled={loading}
        className="rounded-full border border-black/[.15] px-3 py-1 font-medium hover:bg-black/[.04] disabled:opacity-50 dark:border-white/[.2] dark:hover:bg-white/[.06]"
      >
        {loading ? "Fetching…" : "GET /api/todos"}
      </button>
      {todos && (
        <ul className="list-disc space-y-1 pl-5">
          {todos.map((todo) => (
            <li key={todo.id}>
              {todo.text} — {todo.done ? "done" : "not done"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
