"use client";

import { useState } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

/**
 * Two side-by-side lists sharing the same state, one keyed by `todo.id`
 * (correct) and one keyed by array index (buggy). Removing the first
 * item shows the index-keyed list "confuse" its remaining rows, because
 * their inputs are uncontrolled DOM elements React reuses by position.
 */
export function KeyComparisonDemo() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  function removeFirst() {
    setTodos((prev) => prev.slice(1));
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={removeFirst}
        className="rounded-lg border border-black/[.08] px-3 py-1.5 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
      >
        Remove first todo
      </button>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            key={"{todo.id}"} — correct
          </div>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
              >
                <input type="checkbox" defaultChecked={todo.done} className="h-4 w-4" />
                <span>{todo.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            key={"{index}"} — buggy
          </div>
          <ul className="space-y-2">
            {todos.map((todo, index) => (
              <li
                key={index}
                className="flex items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
              >
                <input type="checkbox" defaultChecked={todo.done} className="h-4 w-4" />
                <span>{todo.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Try checking a box, then clicking &quot;Remove first todo&quot;. The left list&apos;s
        checkbox state stays attached to the right todo. The right list&apos;s checkbox states
        don&apos;t move with their todos, because React matches index-keyed elements by position,
        not identity.
      </p>
    </div>
  );
}
