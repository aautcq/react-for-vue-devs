"use client";

import { useState } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

function TodoRow({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2 dark:border-white/[.145]">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4"
      />
      <span
        onClick={() => onToggle(todo.id)}
        className={`flex-1 cursor-pointer ${todo.done ? "text-zinc-400 line-through" : ""}`}
      >
        {todo.text}
      </span>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="rounded-full border border-black/[.08] px-2 py-0.5 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
      >
        Delete
      </button>
    </li>
  );
}

/**
 * Todo list wired up with click-to-toggle and delete handlers, passed
 * down to TodoRow as plain function props named onX.
 */
export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoRow key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
      ))}
    </ul>
  );
}
