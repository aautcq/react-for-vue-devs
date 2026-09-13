# tRPC Supersedes the REST Route Handler, Reusing the Same TanStack Query Client

Once the TanStack Query Track stands up `/api/todos` as a hand-written JSON contract (see
ADR-0002), the tRPC Track needs to decide whether its typed router is a *third* API surface
alongside Server Actions and the REST handler, or a replacement for the REST handler specifically.

We chose replacement-in-narrative: the tRPC Track's `todoRouter` (`lib/trpc/router.ts`) calls the
exact same `server-store` functions the REST handler calls, exposed via `@trpc/server`'s fetch
adapter at `/api/trpc/[trpc]`, and its Demo reuses `@tanstack/react-query` underneath via
`@trpc/tanstack-react-query` — the same `QueryClient` mental model the reader just learned, now
with inferred types instead of manually-typed `fetch` calls and response shapes. The lesson content
explicitly frames tRPC as "the same job as the REST handler, done with types," rather than
introducing it as an unrelated third option.

We did **not** delete `/api/todos` — the REST handler stays live as the TanStack Query Track's own
teaching artifact, since a reader doing the Tracks in order needs to see the "before" (hand-rolled
REST) to appreciate the "after" (typed router). This does mean the Running Example's todos are now
reachable through three parallel surfaces (Server Actions, REST, tRPC) that all read/write one
underlying store — an intentional redundancy for pedagogy, worth flagging so a future reader doesn't
"clean up" the REST handler thinking it's dead code once tRPC exists.
