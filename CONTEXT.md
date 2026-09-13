# React Course

A personalized, in-app course teaching the React ecosystem (this repo's own future/breaking-changes
version of React, Next.js, and its most common companion libraries) to a Vue/Nuxt expert. The app
itself IS the course: running `next dev` renders the lessons.

## Language

**Track**:
A top-level curriculum section covering one library/framework in depth. There are six: the React
Track (fundamentals), the Next.js Track (App Router, server/client model, data), the TanStack Query
Track, the Redux Track, the tRPC Track, and the Motion Track (`framer-motion`, now `motion`). Tracks
are completed in that order — React and Next.js first, since every later Track's Demo builds on the
Running Example they establish.

**Lesson**:
A single routed page teaching one focused concept within a Track. Combines prose, a live rendered
Demo, its visible source snippet, a Vue/Nuxt comparison callout, and a closing Exercise.
_Avoid_: Chapter, page, topic (when meaning a lesson specifically)

**Demo**:
A small live-rendered React component embedded in a Lesson that shows the concept running, not just
described.
_Avoid_: Example, sandbox

**Exercise**:
A knowledge-check or small coding prompt at the end of a Lesson, distinct from the Demo. Confirms
understanding rather than illustrating a concept.
_Avoid_: Quiz, assignment

**Running Example**:
One small app (spanning every Track) built up incrementally across lessons, layering on new
concepts as they're introduced, to show concepts working together rather than in isolation.
_Avoid_: Capstone, project (ambiguous with the repo itself)

**Vue/Nuxt Comparison**:
An explicit callout in a Lesson mapping the concept just taught to its closest Vue/Nuxt equivalent
(e.g. "useState ≈ ref()"). Present throughout every Track given the reader's Vue/Nuxt background.

**Server State**:
Data whose source of truth lives on the server — the Running Example's todos. Owned by Server
Actions (React/Next Tracks), a REST Route Handler (TanStack Query Track), or a typed tRPC router
(tRPC Track), depending on which lesson is fetching/mutating it. Never owned by Redux.
_Avoid_: Server data (too vague — doesn't distinguish it from Client State)

**Client State**:
Data that only ever exists in the browser and has no server-side source of truth — e.g. which todo
filter is active, or whether a mutation is in flight. This is what the Redux Track's store holds;
it deliberately never duplicates Server State.
_Avoid_: UI state (used informally in comments, but Client State is the canonical term)

**Procedure**:
A single typed operation exposed by a tRPC router (a query or a mutation), analogous to one
Route Handler export but with inferred input/output types instead of a hand-written JSON contract.
_Avoid_: Endpoint (reserved for untyped Route Handlers), Resolver

