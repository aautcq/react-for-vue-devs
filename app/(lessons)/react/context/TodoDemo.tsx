"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

type Filter = "all" | "active" | "completed";

// The context only carries the filter concern — not the whole todo list —
// so anything unrelated to filtering doesn't need to consume it at all.
const TodoFilterContext = createContext<{
  filter: Filter;
  setFilter: (filter: Filter) => void;
} | null>(null);

function useTodoFilter() {
  const context = useContext(TodoFilterContext);
  if (!context) {
    throw new Error("useTodoFilter must be used inside a TodoFilterContext.Provider");
  }
  return context;
}

function FilterButtons() {
  const { filter, setFilter } = useTodoFilter();
  const options: Filter[] = ["all", "active", "completed"];
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setFilter(option)}
          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
            filter === option
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
              : "border-black/[.15] dark:border-white/[.2]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  // Consumes the same context several component layers below the provider,
  // without FilterButtons or any parent needing to pass `filter` as a prop.
  const { filter } = useTodoFilter();
  const visible = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "completed") return todo.done;
    return true;
  });

  return (
    <ul className="space-y-1 text-sm">
      {visible.map((todo) => (
        <li key={todo.id} className={todo.done ? "line-through opacity-50" : ""}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

export function TodoDemo() {
  const [todos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Filter>("all");
  // Memoize the provided value so consumers don't see a new object identity
  // on every render of TodoDemo for unrelated reasons.
  const value = useMemo(() => ({ filter, setFilter }), [filter]);

  return (
    <TodoFilterContext.Provider value={value}>
      <div className="space-y-3">
        <FilterButtons />
        <TodoList todos={todos} />
      </div>
    </TodoFilterContext.Provider>
  );
}
