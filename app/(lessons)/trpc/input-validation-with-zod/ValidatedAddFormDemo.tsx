"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TodoTRPCProvider } from "@/lib/trpc/Provider";
import { useTRPC } from "@/lib/trpc/client";

/**
 * Deliberately skips the usual `if (!text.trim()) return` client-side
 * guard, so submitting empty (or whitespace-only) text actually reaches
 * the server and gets rejected by the `add` procedure's zod schema —
 * proving the validation is enforced there, not just in the UI.
 */
function ValidatedAddForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const { data, isPending, isError } = useQuery(trpc.list.queryOptions());

  const addMutation = useMutation(
    trpc.add.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.list.queryKey() });
        setText("");
      },
    })
  );

  if (isPending) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (isError) return <p className="text-sm text-red-600">Something went wrong.</p>;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addMutation.mutate({ text });
        }}
        className="mb-2 flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Try submitting this empty"
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
      {addMutation.isError && (
        <p className="mb-3 text-xs text-red-600">
          Rejected by the server: {addMutation.error.message}
        </p>
      )}
      <ul className="space-y-1.5">
        {data.map((todo) => (
          <li key={todo.id} className="text-sm">
            <span className={todo.done ? "text-zinc-400 line-through" : ""}>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ValidatedAddFormDemo() {
  return (
    <TodoTRPCProvider>
      <ValidatedAddForm />
    </TodoTRPCProvider>
  );
}
