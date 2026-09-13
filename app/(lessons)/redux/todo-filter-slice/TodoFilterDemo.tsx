"use client";

import { useState } from "react";
import { TodoStoreProvider } from "@/lib/redux/Provider";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { filterChanged, pendingEnded, pendingStarted, type TodoFilter } from "@/lib/redux/todoUiSlice";
import { initialTodos, type Todo } from "@/lib/todo-app/types";

// Stands in for the real server round-trip (Server Actions / TanStack
// Query / tRPC, depending on the lesson) so this Demo can show the
// pending-flag UI without wiring up an actual mutation.
function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 600));
}

const filters: TodoFilter[] = ["all", "active", "done"];

function TodoFilterList() {
  // The todos themselves are plain component state — local demo data, not
  // server state and not Redux state. Redux only owns the filter and which
  // IDs are mid-mutation.
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const filter = useAppSelector((state) => state.todoUi.filter);
  const pendingIds = useAppSelector((state) => state.todoUi.pendingIds);
  const dispatch = useAppDispatch();

  const visible = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "done") return todo.done;
    return true;
  });

  async function handleToggle(id: string) {
    dispatch(pendingStarted(id));
    await simulateLatency();
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
    dispatch(pendingEnded(id));
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => dispatch(filterChanged(f))}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
              filter === f
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                : "border-black/[.15] dark:border-white/[.2]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <ul className="space-y-1 text-sm">
        {visible.map((todo) => {
          const isPending = pendingIds.includes(todo.id);
          return (
            <li key={todo.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.done}
                disabled={isPending}
                onChange={() => handleToggle(todo.id)}
              />
              <span className={todo.done ? "line-through opacity-50" : ""}>{todo.text}</span>
              {isPending && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">saving…</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function TodoFilterDemo() {
  return (
    <TodoStoreProvider>
      <TodoFilterList />
    </TodoStoreProvider>
  );
}
