"use client";

import { useState } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

/**
 * Interactive Todo list: add/toggle/remove, all via immutable useState
 * updates. This is the Running Example's first stateful version.
 */
export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [draft, setDraft] = useState("");

  function addTodo() {
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
    setDraft("");
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="h-4 w-4"
            />
            <span className={`flex-1 ${todo.done ? "text-zinc-400 line-through" : ""}`}>
              {todo.text}
            </span>
            <button
              type="button"
              onClick={() => removeTodo(todo.id)}
              className="rounded-full border border-black/[.08] px-2 py-0.5 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="New todo..."
          className="flex-1 rounded-lg border border-black/[.08] px-3 py-1.5 text-sm dark:border-white/[.145] dark:bg-transparent"
        />
        <button
          type="button"
          onClick={addTodo}
          className="rounded-lg border border-black/[.08] px-3 py-1.5 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
        >
          Add
        </button>
      </div>
    </div>
  );
}
