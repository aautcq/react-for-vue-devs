"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TodoTRPCProvider } from "@/lib/trpc/Provider";
import { useTRPC } from "@/lib/trpc/client";

function TypedTodoList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const { data, isPending, isError } = useQuery(trpc.list.queryOptions());

  const invalidate = () => queryClient.invalidateQueries({ queryKey: trpc.list.queryKey() });

  const addMutation = useMutation(trpc.add.mutationOptions({ onSuccess: invalidate }));
  const toggleMutation = useMutation(trpc.toggle.mutationOptions({ onSuccess: invalidate }));
  const removeMutation = useMutation(trpc.remove.mutationOptions({ onSuccess: invalidate }));

  if (isPending) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (isError) return <p className="text-sm text-red-600">Something went wrong.</p>;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          addMutation.mutate({ text });
          setText("");
        }}
        className="mb-3 flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a todo"
          className="flex-1 rounded-md border border-black/[.08] px-2 py-1 text-sm dark:border-white/[.145] dark:bg-transparent"
        />
        <button
          type="submit"
          disabled={addMutation.isPending}
          className="rounded-full border border-black/[.08] px-3 py-1 text-xs hover:bg-black/[.04] disabled:opacity-50 dark:border-white/[.145] dark:hover:bg-white/[.04]"
        >
          Add
        </button>
      </form>
      <ul className="space-y-1.5">
        {data.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 text-sm">
            <span className={`flex-1 ${todo.done ? "text-zinc-400 line-through" : ""}`}>
              {todo.text}
            </span>
            <button
              type="button"
              onClick={() => toggleMutation.mutate({ id: todo.id })}
              className="rounded-full border border-black/[.08] px-2 py-0.5 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
            >
              {todo.done ? "Undo" : "Done"}
            </button>
            <button
              type="button"
              onClick={() => removeMutation.mutate({ id: todo.id })}
              className="rounded-full border border-black/[.08] px-2 py-0.5 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TypedTodoListDemo() {
  return (
    <TodoTRPCProvider>
      <TypedTodoList />
    </TodoTRPCProvider>
  );
}
