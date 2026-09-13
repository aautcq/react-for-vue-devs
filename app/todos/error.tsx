"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

/**
 * Route-segment error boundary for /todos. Next.js renders this in place of
 * the segment's tree whenever a rendering error is thrown anywhere beneath
 * it (in a Server or Client Component). See CONTEXT.md: "Running Example".
 */
export default function TodosError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // In a real app, send this to an error reporting service.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-3 px-6 py-16">
      <h2 className="text-xl font-semibold">Something went wrong loading your todos.</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{error.message}</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-full border border-black/[.15] px-4 py-1.5 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.06]"
      >
        Try again
      </button>
    </div>
  );
}
