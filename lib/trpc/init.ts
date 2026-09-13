/**
 * The tRPC backend instance. Separate from router.ts so procedures and
 * middleware can be built up without re-initializing tRPC itself.
 * See the Routers & Procedures lesson.
 */
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
