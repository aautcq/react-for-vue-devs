"use client";

import { useState, type FormEvent } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

/**
 * Todo list with a controlled-input form: the input's value is fully
 * derived from state, and submitting adds a new todo without a page reload.
 */
export function TodoForm() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [text, setText] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, done: false }]);
    setText("");
  }

  return (
    <div className="space-y-3">
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
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo..."
          className="flex-1 rounded-lg border border-black/[.08] px-3 py-1.5 text-sm dark:border-white/[.145] dark:bg-transparent"
        />
        <button
          type="submit"
          className="rounded-lg border border-black/[.08] px-3 py-1.5 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
        >
          Add
        </button>
      </form>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Current input value (state): <code>&quot;{text}&quot;</code>
      </p>
    </div>
  );
}
