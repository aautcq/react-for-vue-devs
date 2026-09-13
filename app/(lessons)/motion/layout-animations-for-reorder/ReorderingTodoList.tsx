"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

/**
 * Toggling "done" reshuffles the list (done items sink to the bottom).
 * The `layout` prop makes each row FLIP-animate into its new position
 * automatically, with no manual measuring or CSS.
 */
export function ReorderingTodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  function toggleTodo(id: string) {
    setTodos((prev) =>
      [...prev]
        .map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
        .sort((a, b) => Number(a.done) - Number(b.done))
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <motion.li
          key={todo.id}
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
        </motion.li>
      ))}
    </ul>
  );
}
