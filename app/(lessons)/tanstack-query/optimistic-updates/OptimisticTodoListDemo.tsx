"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoQueryProvider } from "@/lib/query/Provider";
import type { Todo } from "@/lib/todo-app/types";

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

async function patchTodo(id: string): Promise<void> {
  const res = await fetch("/api/todos", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to toggle todo");
}

function OptimisticTodoList() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

  const toggleMutation = useMutation({
    mutationFn: patchTodo,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
      );

      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isPending) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (isError) return <p className="text-sm text-red-600">Something went wrong.</p>;

  return (
    <ul className="space-y-1.5">
      {data.map((todo) => (
        <li key={todo.id} className="flex items-center gap-2 text-sm">
          <span className={`flex-1 ${todo.done ? "text-zinc-400 line-through" : ""}`}>
            {todo.text}
          </span>
          <button
            type="button"
            onClick={() => toggleMutation.mutate(todo.id)}
            className="rounded-full border border-black/[.08] px-2 py-0.5 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
          >
            {todo.done ? "Undo" : "Done"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function OptimisticTodoListDemo() {
  return (
    <TodoQueryProvider>
      <OptimisticTodoList />
    </TodoQueryProvider>
  );
}
