"use client";

import { useQuery } from "@tanstack/react-query";
import { TodoQueryProvider } from "@/lib/query/Provider";
import type { Todo } from "@/lib/todo-app/types";

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

function TodoCount() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isPending) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (isError) return <p className="text-sm text-red-600">Something went wrong.</p>;

  return (
    <p className="text-sm">
      <code>/api/todos</code> currently has <strong>{data.length}</strong> todo
      {data.length === 1 ? "" : "s"}.
    </p>
  );
}

export function TodoCountDemo() {
  return (
    <TodoQueryProvider>
      <TodoCount />
    </TodoQueryProvider>
  );
}
