/**
 * The course's Lesson registry. Drives sidebar navigation, prev/next links,
 * and the landing page's table of contents. See CONTEXT.md for "Track" / "Lesson".
 */

export type Track = "react" | "next" | "tanstack-query" | "redux" | "trpc" | "motion";

export type LessonMeta = {
  slug: string;
  title: string;
  /** One-line summary shown in nav and the landing page ToC. */
  blurb: string;
};

export const trackTitles: Record<Track, string> = {
  react: "React",
  next: "Next.js",
  "tanstack-query": "TanStack Query",
  redux: "Redux",
  trpc: "tRPC",
  motion: "Framer Motion",
};

export const lessons: Record<Track, LessonMeta[]> = {
  react: [
    {
      slug: "jsx-and-rendering",
      title: "JSX & the Rendering Model",
      blurb: "How JSX compiles, and how React's rendering differs from Vue's compiler-optimized reactivity.",
    },
    {
      slug: "components-and-props",
      title: "Components & Props",
      blurb: "Function components and one-way prop flow — introducing the Todo running example.",
    },
    {
      slug: "state-with-usestate",
      title: "State with useState",
      blurb: "Local component state, immutable updates, and functional updates.",
    },
    {
      slug: "lists-and-keys",
      title: "Rendering Lists & Keys",
      blurb: "Why React needs explicit `key`s, unlike Vue's `v-for`.",
    },
    {
      slug: "conditional-rendering",
      title: "Conditional Rendering",
      blurb: "&&, ternaries, and early returns instead of v-if/v-show.",
    },
    {
      slug: "handling-events",
      title: "Handling Events",
      blurb: "SyntheticEvent handlers vs Vue's @click directives.",
    },
    {
      slug: "forms-and-controlled-inputs",
      title: "Forms & Controlled Inputs",
      blurb: "Controlled inputs vs Vue's v-model two-way binding.",
    },
    {
      slug: "useeffect-and-side-effects",
      title: "useEffect & Side Effects",
      blurb: "Synchronizing with the outside world; comparing to watchEffect/onMounted.",
    },
    {
      slug: "refs-and-useref",
      title: "Refs & useRef",
      blurb: "Escape hatches to the DOM and mutable values that don't trigger renders.",
    },
    {
      slug: "context",
      title: "Context",
      blurb: "Avoiding prop drilling, compared to Vue's provide/inject.",
    },
    {
      slug: "usereducer",
      title: "useReducer",
      blurb: "Centralizing related state transitions into one reducer function.",
    },
    {
      slug: "custom-hooks",
      title: "Custom Hooks",
      blurb: "Extracting reusable stateful logic, React's answer to Vue composables.",
    },
    {
      slug: "memoization",
      title: "memo, useMemo & useCallback",
      blurb: "Why React needs manual memoization where Vue's reactivity is fine-grained by default.",
    },
    {
      slug: "error-boundaries",
      title: "Error Boundaries",
      blurb: "Catching rendering errors, compared to Vue's onErrorCaptured.",
    },
  ],
  next: [
    {
      slug: "project-structure",
      title: "Project Structure & Conventions",
      blurb: "The app/ directory's file conventions, compared to Nuxt's pages/ auto-routing.",
    },
    {
      slug: "routing-layouts-pages",
      title: "Routing, Layouts & Pages",
      blurb: "File-system routing, nested layouts, and route groups.",
    },
    {
      slug: "linking-and-navigation",
      title: "Linking & Navigation",
      blurb: "The <Link> component and client-side transitions.",
    },
    {
      slug: "server-and-client-components",
      title: "Server vs Client Components",
      blurb: "The default rendering model, and the 'use client' boundary.",
    },
    {
      slug: "fetching-data",
      title: "Fetching Data",
      blurb: "async/await directly in Server Components, vs Nuxt's useFetch/useAsyncData.",
    },
    {
      slug: "mutating-data-server-actions",
      title: "Mutating Data / Server Actions",
      blurb: "Server Actions as colocated server-side mutations, vs Nuxt server routes.",
    },
    {
      slug: "caching",
      title: "Caching",
      blurb: "This repo's cache model for requests, renders, and data.",
    },
    {
      slug: "revalidating",
      title: "Revalidating",
      blurb: "Invalidating cached data after a mutation.",
    },
    {
      slug: "error-handling",
      title: "Error Handling",
      blurb: "error.tsx boundaries per route segment, vs Nuxt's error.vue.",
    },
    {
      slug: "metadata",
      title: "Metadata & OG Images",
      blurb: "The metadata API, vs Nuxt's useHead/definePageMeta.",
    },
    {
      slug: "route-handlers",
      title: "Route Handlers",
      blurb: "Building API endpoints inside app/, vs Nuxt's server/api routes.",
    },
    {
      slug: "deploying",
      title: "Deploying",
      blurb: "What changes between `next dev` and a production deployment.",
    },
  ],
  "tanstack-query": [
    {
      slug: "setup-and-query-client",
      title: "Setup & QueryClientProvider",
      blurb: "Standing up a QueryClient alongside the Next Track's Server Components fetching.",
    },
    {
      slug: "usequery-for-todos",
      title: "useQuery for the Todo List",
      blurb: "Client-fetched, cached todos via /api/todos — vs. the Fetching Data lesson's server-side await.",
    },
    {
      slug: "usemutation-and-invalidation",
      title: "useMutation & Cache Invalidation",
      blurb: "Adding/toggling todos from the client and invalidating the query cache.",
    },
    {
      slug: "optimistic-updates",
      title: "Optimistic Updates",
      blurb: "Updating the cache before the server responds, and rolling back on error.",
    },
  ],
  redux: [
    {
      slug: "store-and-slices",
      title: "Store & Slices",
      blurb: "configureStore and createSlice, compared to Pinia's defineStore.",
    },
    {
      slug: "selectors-and-dispatch",
      title: "Selectors & Dispatch",
      blurb: "useSelector/useDispatch and the typed hooks pattern.",
    },
    {
      slug: "todo-filter-slice",
      title: "A Filter Slice for the Todo List",
      blurb: "Client-only UI state (filter, pending flag) layered over the server-owned todos.",
    },
    {
      slug: "where-redux-stops",
      title: "Where Redux Stops",
      blurb: "Why the todos themselves stay server state, not Redux state.",
    },
  ],
  trpc: [
    {
      slug: "routers-and-procedures",
      title: "Routers & Procedures",
      blurb: "Defining a typed API surface with initTRPC, queries, and mutations.",
    },
    {
      slug: "the-fetch-adapter-route-handler",
      title: "The Fetch Adapter Route Handler",
      blurb: "Serving a router from a Next.js Route Handler with fetchRequestHandler.",
    },
    {
      slug: "a-typed-client-over-tanstack-query",
      title: "A Typed Client, Same TanStack Query",
      blurb: "Replacing hand-rolled fetch calls with end-to-end types, same QueryClient underneath.",
    },
    {
      slug: "input-validation-with-zod",
      title: "Input Validation with Zod",
      blurb: "Parsing and validating procedure input at the boundary.",
    },
  ],
  motion: [
    {
      slug: "motion-basics",
      title: "motion.div & the Framer Motion → Motion Rename",
      blurb: "Animating props declaratively, and why the import is now `motion/react`.",
    },
    {
      slug: "animatepresence-for-todos",
      title: "AnimatePresence for Add & Remove",
      blurb: "Exit animations for unmounting list items, vs. Vue's <transition-group>.",
    },
    {
      slug: "layout-animations-for-reorder",
      title: "Layout Animations for Reorder",
      blurb: "The layout prop animating position changes automatically.",
    },
    {
      slug: "variants-and-gestures",
      title: "Variants & Gestures",
      blurb: "Named animation states and whileHover/whileTap interaction shortcuts.",
    },
  ],
};

export function lessonPath(track: Track, slug: string): `/${Track}/${string}` {
  return `/${track}/${slug}`;
}

const trackOrder: Track[] = ["react", "next", "tanstack-query", "redux", "trpc", "motion"];

/** Flat, ordered list across every Track, in curriculum order. */
export function allLessonsInOrder(): Array<LessonMeta & { track: Track }> {
  return trackOrder.flatMap((track) => lessons[track].map((l) => ({ ...l, track })));
}

export function adjacentLessons(track: Track, slug: string) {
  const ordered = allLessonsInOrder();
  const index = ordered.findIndex((l) => l.track === track && l.slug === slug);
  return {
    previous: index > 0 ? ordered[index - 1] : undefined,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined,
  };
}
