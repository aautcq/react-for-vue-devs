"use client";

/**
 * The typed React bindings for the todo router, built once and reused by
 * every Demo in the tRPC Track. `useTRPC()` returns a proxy of
 * queryOptions/mutationOptions for TanStack Query — the client stays
 * TanStack Query underneath, just with typed inputs/outputs.
 */
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "./router";

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
