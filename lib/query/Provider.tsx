"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Scoped to whichever Demo mounts it, not the root layout — this course is
 * many independent static pages, not one long-lived SPA, so each Demo gets
 * its own QueryClient via useState() rather than sharing a module-level
 * singleton. See the Setup & QueryClientProvider lesson.
 */
export function TodoQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
