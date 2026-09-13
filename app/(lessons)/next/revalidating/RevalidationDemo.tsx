"use client";

import { useState } from "react";

/**
 * A purely client-side illustration of the *idea* of cache staleness vs
 * revalidation — this is NOT the real Next.js mechanism (no server, no
 * fetch cache, no Server Action). It's here to build intuition before the
 * real APIs below.
 */
export function RevalidationDemo() {
  const [source, setSource] = useState(0);
  const [staleView, setStaleView] = useState(0);

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setSource((n) => n + 1)}
          className="rounded-full border border-black/[.15] px-3 py-1 font-medium hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.06]"
        >
          Mutate source data ({source})
        </button>
        <button
          type="button"
          onClick={() => setStaleView(source)}
          className="rounded-full border border-black/[.15] px-3 py-1 font-medium hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.06]"
        >
          Manually &quot;revalidate&quot;
        </button>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400">
        &quot;Cached&quot; view (stale until revalidated): <strong>{staleView}</strong>
      </p>
      <p className="text-zinc-500 dark:text-zinc-400">
        Live source value: <strong>{source}</strong>
      </p>
    </div>
  );
}
