import type { ReactNode } from "react";

/**
 * Wraps a live-rendered example so it's visually distinct from prose and
 * from its accompanying <CodeBlock>. See CONTEXT.md: "Demo".
 */
export function Demo({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-dashed border-black/[.15] p-5 dark:border-white/[.2]">
      {title && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Live demo — {title}
        </div>
      )}
      {children}
    </div>
  );
}
