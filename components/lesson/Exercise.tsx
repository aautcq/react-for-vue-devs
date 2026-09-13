"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * A closing knowledge-check/prompt with an inline "Show solution" reveal.
 * See CONTEXT.md: "Exercise".
 */
export function Exercise({
  prompt,
  solution,
}: {
  prompt: ReactNode;
  solution: ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);
  const solutionId = useId();

  return (
    <div className="my-6 rounded-lg border border-amber-600/30 bg-amber-600/[.06] p-5 dark:border-amber-400/30 dark:bg-amber-400/[.06]">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
        <span aria-hidden>✏️</span> Exercise
      </div>
      <div className="text-sm text-zinc-700 dark:text-zinc-300">{prompt}</div>
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        aria-expanded={revealed}
        aria-controls={solutionId}
        className="mt-3 rounded-full border border-amber-700/30 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-600/10 dark:border-amber-400/30 dark:text-amber-300"
      >
        {revealed ? "Hide solution" : "Show solution"}
      </button>
      {revealed && (
        <div id={solutionId} className="mt-3 border-t border-amber-700/20 pt-3 dark:border-amber-400/20">
          {solution}
        </div>
      )}
    </div>
  );
}
