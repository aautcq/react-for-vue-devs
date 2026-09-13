import Link from "next/link";
import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoCountDemo } from "./TodoCountDemo";

export default function Page() {
  return (
    <Lesson track="tanstack-query" slug="setup-and-query-client" title="Setup & QueryClientProvider">
      <p>
        The Fetching Data lesson made the case that a Server Component&apos;s <code>await</code>{" "}
        is often all the data-fetching you need — there&apos;s no client-side loading state to
        manage because the component doesn&apos;t render until the data has already arrived. That
        holds as long as the fetch only ever needs to happen once, on the server, before the page
        is sent down. <strong>TanStack Query</strong> is for the cases that don&apos;t fit that
        mold: a Client Component that needs to refetch on its own schedule, dedupe the same request
        fired from two components, retry on failure, or optimistically update before the server has
        even responded. None of that is something a Server Component&apos;s one-shot{" "}
        <code>await</code> can do — it only ever runs once, server-side, per request.
      </p>
      <p>
        TanStack Query&apos;s unit of work is a <strong>query</strong>: a cached, keyed request.
        Everything routes through one <code>QueryClient</code> instance, which holds the cache and
        is handed to the component tree via <code>&lt;QueryClientProvider&gt;</code>:
      </p>
      <CodeBlock
        filename="the QueryClientProvider contract"
        code={`
"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

function Providers({ children }: { children: React.ReactNode }) {
  // useState, not a module-level singleton — one QueryClient per mount,
  // so server-rendered data isn't accidentally shared across requests.
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
`}
      />
      <p>
        A real app usually mounts one <code>QueryClient</code> near the root and shares it
        everywhere. This course is many independent lesson pages rather than one long-lived app, so
        each Demo in this Track mounts its own scoped <code>&lt;TodoQueryProvider&gt;</code>{" "}
        instead — same API, just instantiated per-Demo rather than once globally.
      </p>
      <p>
        With a client in place, <code>useQuery</code> takes a <code>queryKey</code> (an array that
        identifies this cached request) and a <code>queryFn</code> that returns a promise:
      </p>
      <CodeBlock
        filename="the useQuery contract"
        code={`
const { data, isPending, isError } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos, // () => Promise<Todo[]>
})
`}
      />
      <p>
        Try it against the Running Example&apos;s{" "}
        <Link href="/api/todos" className="font-medium underline">
          /api/todos
        </Link>{" "}
        Route Handler (from the Route Handlers lesson) — the same JSON endpoint, now fetched from
        the client and cached instead of read once on the server:
      </p>
      <Demo title="useQuery reading the real /api/todos endpoint">
        <TodoCountDemo />
      </Demo>
      <p>
        The next lesson builds this into a full read UI for the Todo list; the one after that adds
        mutations.
      </p>
      <VueComparison>
        Nuxt doesn&apos;t need a separate caching library for the common case, because{" "}
        <code>useFetch</code>/<code>useAsyncData</code> already dedupe and cache by key out of the
        box. Where Nuxt apps reach for <strong>TanStack Query&apos;s Vue adapter</strong>{" "}
        (<code>@tanstack/vue-query</code> — yes, the same library, just with Vue bindings) is
        exactly the same situation as here: client-triggered refetching, mutations with cache
        invalidation, and fine-grained control over retries/staleness that the built-in composables
        don&apos;t expose.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Two components on the same page both call{" "}
            <code>useQuery(&#123; queryKey: [&quot;todos&quot;], queryFn: fetchTodos &#125;)</code>.
            Does TanStack Query fire two network requests, or one? Why does the shared{" "}
            <code>queryKey</code> matter here?
          </p>
        }
        solution={
          <p>
            One request. The <code>queryKey</code> is how the <code>QueryClient</code> identifies a
            cache entry — two <code>useQuery</code> calls with the same key subscribe to the{" "}
            <em>same</em> cached entry rather than each triggering their own fetch. This is exactly
            the deduplication a plain <code>useEffect</code>-based fetch doesn&apos;t give you for
            free: two components each running their own effect would fire two separate requests.
          </p>
        }
      />
    </Lesson>
  );
}
