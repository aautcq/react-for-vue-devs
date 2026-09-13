import type { ReactNode } from "react";

/**
 * A callout mapping the concept just taught to its closest Vue/Nuxt
 * equivalent. See CONTEXT.md: "Vue/Nuxt Comparison".
 */
export function VueComparison({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 flex gap-3 rounded-lg border border-emerald-600/20 bg-emerald-600/[.06] p-4 text-sm dark:border-emerald-400/20 dark:bg-emerald-400/[.06]">
      <span aria-hidden className="text-lg leading-none">🟢</span>
      <div>
        <div className="mb-1 font-semibold text-emerald-800 dark:text-emerald-300">
          In Vue/Nuxt terms
        </div>
        <div className="text-zinc-700 dark:text-zinc-300">{children}</div>
      </div>
    </div>
  );
}
