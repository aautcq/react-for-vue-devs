"use client";

import { useQuery } from "@tanstack/react-query";
import { TodoQueryProvider } from "@/lib/query/Provider";
import type { Todo } from "@/lib/todo-app/types";

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

function TodoListReadOnly() {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isPending) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (isError) return <p className="text-sm text-red-600">Something went wrong.</p>;

  return (
    <div>
      <ul className="space-y-1.5">
        {data.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 text-sm">
            <span className={todo.done ? "text-zinc-400 line-through" : ""}>{todo.text}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => refetch()}
        disabled={isFetching}
        className="mt-3 rounded-full border border-black/[.08] px-3 py-1 text-xs hover:bg-black/[.04] disabled:opacity-50 dark:border-white/[.145] dark:hover:bg-white/[.04]"
      >
        {isFetching ? "Refetching…" : "Refetch"}
      </button>
    </div>
  );
}

export function TodoListReadOnlyDemo() {
  return (
    <TodoQueryProvider>
      <TodoListReadOnly />
    </TodoQueryProvider>
  );
}
