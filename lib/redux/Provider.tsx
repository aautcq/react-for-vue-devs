"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

/** Scoped per-Demo, matching the tRPC/TanStack Query providers' pattern. */
export function TodoStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
