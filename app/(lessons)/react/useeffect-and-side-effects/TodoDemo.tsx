"use client";

import { useEffect, useState } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

const STORAGE_KEY = "useeffect-lesson-todos";

function loadInitialTodos(): Todo[] {
  // Guard: this module also runs during server rendering, where `localStorage`
  // doesn't exist. A lazy useState initializer only runs once, client-side,
  // after hydration would otherwise be too late — so we check `typeof window`.
  if (typeof window === "undefined") {
    return initialTodos;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Todo[]) : initialTodos;
}

export function TodoDemo() {
  const [todos, setTodos] = useState<Todo[]>(loadInitialTodos);
  const [text, setText] = useState("");

  // Synchronize React state with an external system (localStorage) whenever
  // `todos` changes. This is the point of useEffect: not "run some code after
  // render", but "keep this outside-of-React thing in sync with this state".
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (!text.trim()) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
    setText("");
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="New todo"
          className="flex-1 rounded-md border border-black/[.15] bg-transparent px-3 py-1.5 text-sm dark:border-white/[.2]"
        />
        <button
          type="button"
          onClick={addTodo}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
        >
          Add
        </button>
      </div>
      <ul className="space-y-1 text-sm">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? "line-through opacity-50" : ""}>
            {todo.text}
          </li>
        ))}
      </ul>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Reload the page — this list survives, because it&apos;s persisted to{" "}
        <code>localStorage</code> in a <code>useEffect</code>.
      </p>
    </div>
  );
}
