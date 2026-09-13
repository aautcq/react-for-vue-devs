"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

// Named states shared between the parent <ul> and its <motion.li> children —
// referenced by key ("hidden" / "visible") instead of writing the same
// style object out at every usage site.
const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function GestureTodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  }

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className="space-y-2"
    >
      {todos.map((todo) => (
        <motion.li
          key={todo.id}
          variants={itemVariants}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(59,130,246,0.06)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => toggleTodo(todo.id)}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
        >
          <span className={`flex-1 ${todo.done ? "text-zinc-400 line-through" : ""}`}>
            {todo.text}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
