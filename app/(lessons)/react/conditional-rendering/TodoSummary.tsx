"use client";

import { useState } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

/**
 * Todo list with an empty-state message and a "X of Y done" summary,
 * demonstrating &&, ternaries, and early returns.
 */
export function TodoSummary() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const doneCount = todos.filter((todo) => todo.done).length;

  function clearAll() {
    setTodos([]);
  }

  function restore() {
    setTodos(initialTodos);
  }

  if (todos.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No todos yet. Nice and tidy!</p>
        <button
          type="button"
          onClick={restore}
          className="rounded-lg border border-black/[.08] px-3 py-1.5 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
        >
          Restore todos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        {doneCount} of {todos.length} done
      </p>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
          >
            <input type="checkbox" defaultChecked={todo.done} className="h-4 w-4" />
            <span className={todo.done ? "text-zinc-400 line-through" : ""}>{todo.text}</span>
          </li>
        ))}
      </ul>
      {doneCount === todos.length && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          All done! 🎉
        </p>
      )}
      <button
        type="button"
        onClick={clearAll}
        className="rounded-lg border border-black/[.08] px-3 py-1.5 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
      >
        Clear all
      </button>
    </div>
  );
}
