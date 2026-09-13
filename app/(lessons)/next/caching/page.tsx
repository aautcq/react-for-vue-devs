import Link from "next/link";
import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="caching" title="Caching">
      <p>
        <strong>This is a real breaking change from older Next.js, not just new terminology.</strong>{" "}
        Versions before 16 cached <code>fetch</code> requests by default using an implicit set of
        heuristics (was there a Request-time API called before this fetch? did you pass a{" "}
        <code>cache</code> option?). This version replaces that with an explicit,
        opt-in model called <strong>Cache Components</strong>: nothing is cached unless you say so
        with a directive, and nothing about a fetch call&apos;s position in your code implicitly
        changes its caching behavior anymore.
      </p>
      <p>
        Cache Components is enabled per-project with a flag in <code>next.config.ts</code>:
      </p>
      <CodeBlock
        filename="next.config.ts"
        code={`
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
`}
      />
      <p>
        <strong>This course&apos;s <code>next.config.ts</code> does not set this flag</strong> — so
        every Server Component in this repo, including <code>/todos</code>, behaves the same way
        Next.js has always behaved without an explicit cache: data is fetched fresh on every
        request, nothing is memoized between requests, and there&apos;s no build-time heuristic
        deciding otherwise for you. That&apos;s exactly why the artificial delay you added to{" "}
        <code>getTodos()</code> in the Fetching Data lesson is felt on every single visit to{" "}
        <Link href="/todos" className="font-medium underline">
          /todos
        </Link>{" "}
        — nothing is caching that result. The rest of this lesson describes the model you&apos;d
        opt into with the flag, since that&apos;s the direction this framework is heading and what
        the official docs now lead with.
      </p>
      <p>
        With Cache Components on, the core primitive is the <code>&quot;use cache&quot;</code>{" "}
        directive. Add it to the top of an async function or component, and its return value is
        cached and reused instead of recomputed:
      </p>
      <CodeBlock
        filename="app/lib/data.ts -- data-level caching"
        code={`
import { cacheLife } from "next/cache"

export async function getUsers() {
  "use cache"
  cacheLife("hours")
  return db.query("SELECT * FROM users")
}
`}
      />
      <CodeBlock
        filename="app/page.tsx -- UI-level caching (a whole component/page)"
        code={`
import { cacheLife } from "next/cache"

export default async function Page() {
  "use cache"
  cacheLife("hours")

  const users = await db.query("SELECT * FROM users")
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
}
`}
      />
      <p>
        <code>cacheLife(&quot;hours&quot;)</code> gives the cached result a lifetime — how long
        before it&apos;s considered stale and re-generated. Anything <em>not</em> wrapped in{" "}
        <code>&quot;use cache&quot;</code> and not derived from a synchronous, request-independent
        source (module-scope constants, a config file read once at import time) is treated as{" "}
        <strong>uncached, request-time data</strong> — and must be wrapped in{" "}
        <code>{"<Suspense>"}</code> so the rest of the page can still be prerendered into a static
        shell around it:
      </p>
      <CodeBlock
        filename="page.tsx -- streaming uncached data"
        code={`
import { Suspense } from "react"

async function LatestPosts() {
  const data = await fetch("https://api.example.com/posts")
  const posts = await data.json()
  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}

export default function Page() {
  return (
    <>
      <h1>My Blog</h1>
      <Suspense fallback={<p>Loading posts...</p>}>
        <LatestPosts />
      </Suspense>
    </>
  )
}
`}
      />
      <p>
        This split — cached/static parts prerendered into a shell, uncached parts streamed in
        behind <code>{"<Suspense>"}</code> — is called{" "}
        <strong>Partial Prerendering (PPR)</strong>, and it&apos;s the default rendering strategy
        once Cache Components is on. The same rule applies to request-only APIs like{" "}
        <code>cookies()</code>, <code>headers()</code>, and <code>searchParams</code>: reading them
        outside a <code>{"<Suspense>"}</code> boundary is a build-time error under Cache Components,
        not a silent opt-out into fully dynamic rendering the way it was before.
      </p>
      <p>
        <strong>No live Demo for this lesson.</strong> Flipping <code>cacheComponents</code> is a
        project-wide <code>next.config.ts</code> setting, not something one lesson or route can
        turn on locally — and it would change the rendering rules (Suspense-required boundaries,
        etc.) for every other page in this course, including ones written by lessons after this
        one. Instead, treat <code>/todos</code> itself as the &quot;demo&quot;: reload it and watch
        every request pay the full simulated latency, which is precisely what &quot;nothing cached
        by default&quot; looks like in practice.
      </p>
      <VueComparison>
        Nuxt&apos;s closest equivalents are <strong>route rules</strong> (
        <code>nuxt.config.ts</code>&apos;s <code>routeRules</code>, e.g.{" "}
        <code>{'{ "/blog/**": { swr: 3600 } }'}</code>) for whole-route caching, and the{" "}
        <strong>payload cache</strong> that <code>useAsyncData</code> populates to avoid
        re-fetching identical data after hydration. Both are closer to the &quot;previous
        model&quot; this Next.js version moved away from — heuristics tied to a route or a
        composable call. <code>&quot;use cache&quot;</code> is more explicit and granular: you
        annotate the exact function or component, not the whole route, and you set its lifetime
        directly with <code>cacheLife</code> rather than a route-rules table.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            With Cache Components enabled, a page reads <code>cookies()</code> directly in its
            top-level component body (no <code>{"<Suspense>"}</code> anywhere). What happens, and
            what are the two ways to fix it mentioned in this lesson?
          </p>
        }
        solution={
          <p>
            It&apos;s a build-time error — Cache Components requires request-time APIs like{" "}
            <code>cookies()</code> to be reachable only inside a <code>{"<Suspense>"}</code>{" "}
            boundary, so the rest of the route can still be prerendered into a static shell. Fix it
            either by wrapping the component that calls <code>cookies()</code> in{" "}
            <code>{"<Suspense fallback={...}>"}</code>, or — if the value should be cached and
            shared instead of read fresh per request — using the{" "}
            <code>&quot;use cache: private&quot;</code> directive variant, which gives a lifetime to
            a function that reads runtime data directly.
          </p>
        }
      />
    </Lesson>
  );
}
