"use client";

import { useRef, useState } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

export function TodoDemo() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [text, setText] = useState("");
  // A ref to the actual <input> DOM node. Unlike state, setting a ref's
  // `.current` never triggers a re-render — it's just a mutable box.
  const inputRef = useRef<HTMLInputElement>(null);

  function addTodo() {
    if (!text.trim()) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
    setText("");
    // Imperatively refocus the input after adding — this is DOM
    // manipulation React's declarative model doesn't have a prop for.
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          ref={inputRef}
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
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Add a todo, then just start typing again — the input is refocused for you via{" "}
        <code>inputRef.current.focus()</code>, no click required.
      </p>
    </div>
  );
}
