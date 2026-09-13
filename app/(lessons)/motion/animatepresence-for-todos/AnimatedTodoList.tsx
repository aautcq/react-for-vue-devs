"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

/**
 * Add/remove Todo list where removals play a fade + slide-out exit
 * animation before the item actually leaves the DOM, via AnimatePresence.
 */
export function AnimatedTodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [draft, setDraft] = useState("");

  function addTodo() {
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
    setDraft("");
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
            >
              <span className="flex-1">{todo.text}</span>
              <button
                type="button"
                onClick={() => removeTodo(todo.id)}
                className="rounded-full border border-black/[.08] px-2 py-0.5 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
              >
                Remove
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
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
