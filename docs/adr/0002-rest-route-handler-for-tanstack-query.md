# A Standalone REST Route Handler for TanStack Query, instead of Reusing Server Actions

The Next Track already gives the Running Example's todos a server-owned source of truth via
Server Actions (`lib/todo-app/actions.ts`) and Server Components fetching them directly with
`await`. The TanStack Query Track needs a **Client Component** to fetch and mutate that same data
through `useQuery`/`useMutation` — but Server Actions aren't callable as a plain `GET`, and reading
server state from a Client Component idiomatically means hitting an HTTP endpoint, not importing a
`"use server"` function directly.

We extended the existing `app/api/todos/route.ts` (already present for the Next Track's Route
Handlers lesson, previously `GET`-only and returning static data) into a full `GET`/`POST`/`PATCH`/
`DELETE` JSON API backed by the real `lib/todo-app/server-store`, rather than either (a) inventing a
second, parallel "todos" Route Handler, or (b) trying to make Server Actions themselves fetchable
from a `useQuery`. This keeps one server-side source of truth (the store) reachable by both the
Server Actions path and the REST path, so the Running Example stays a single coherent app instead
of forking into two todo lists.

The trade-off: the Route Handlers lesson's Exercise ("sketch a `POST /api/todos` endpoint") now
describes something the repo elsewhere actually implements — acceptable, since the exercise is a
knowledge check done in-the-moment, not a claim that the endpoint doesn't exist anywhere in the
codebase. Reversing this later (e.g. splitting the two concerns back into separate endpoints) would
mean re-threading whichever lessons' Demos still expect `/api/todos` to serve both jobs.
