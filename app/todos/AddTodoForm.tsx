"use client";

import { useActionState } from "react";
import { addTodoAction } from "@/lib/todo-app/actions";

/**
 * The Running Example's add-form. It's a Client Component so it can show a
 * pending state while the Server Action round-trips, but the mutation
 * itself — reading FormData, updating the store, revalidating — happens
 * entirely on the server. See the Server vs Client Components and Mutating
 * Data lessons.
 */
export function AddTodoForm() {
  const [state, formAction, pending] = useActionState(addTodoAction, null);

  return (
    <form action={formAction} className="mb-4 flex items-start gap-2">
      <div className="flex-1">
        <input
          type="text"
          name="text"
          placeholder="New todo"
          className="w-full rounded-lg border border-black/[.08] px-3 py-1.5 text-sm dark:border-white/[.145] dark:bg-transparent"
        />
        {state?.error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{state.error}</p>}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-black/[.08] px-3 py-1.5 text-sm font-medium hover:bg-black/[.04] disabled:opacity-50 dark:border-white/[.145] dark:hover:bg-white/[.04]"
      >
        {pending ? "Adding…" : "Add"}
      </button>
    </form>
  );
}
