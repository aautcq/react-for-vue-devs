# React Course

A personalized, in-app course teaching React and Next.js (this repo's own future/breaking-changes version) to a Vue/Nuxt expert. The app itself IS the course: running `next dev` renders the lessons.

## Language

**Track**:
A top-level curriculum section covering one framework in depth. There are two: the React Track (full React fundamentals) and the Next.js Track (App Router, server/client model, data). The React Track is completed before the Next.js Track.

**Lesson**:
A single routed page teaching one focused concept within a Track. Combines prose, a live rendered Demo, its visible source snippet, a Vue/Nuxt comparison callout, and a closing Exercise.
_Avoid_: Chapter, page, topic (when meaning a lesson specifically)

**Demo**:
A small live-rendered React component embedded in a Lesson that shows the concept running, not just described.
_Avoid_: Example, sandbox

**Exercise**:
A knowledge-check or small coding prompt at the end of a Lesson, distinct from the Demo. Confirms understanding rather than illustrating a concept.
_Avoid_: Quiz, assignment

**Running Example**:
One small app (spanning both Tracks) built up incrementally across lessons, layering on new concepts as they're introduced, to show concepts working together rather than in isolation.
_Avoid_: Capstone, project (ambiguous with the repo itself)

**Vue/Nuxt Comparison**:
An explicit callout in a Lesson mapping the React/Next concept just taught to its closest Vue/Nuxt equivalent (e.g. "useState ≈ ref()"). Present throughout both Tracks given the reader's Vue/Nuxt background.
