import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="error-handling" title="Error Handling">
      <p>
        The React Track&apos;s <strong>Error Boundaries</strong> lesson showed a manual class
        component with <code>static getDerivedStateFromError</code>, hand-placed anywhere you
        want a fallback UI. Next.js gives you a <strong>file-convention</strong> equivalent scoped
        to a route segment: an <code>error.tsx</code> file. Add one next to a{" "}
        <code>page.tsx</code>, and Next.js automatically wraps that segment (and everything below
        it) in an error boundary using your component as the fallback — no manual class component,
        no manually deciding where to nest the boundary.
      </p>
      <CodeBlock
        filename="app/dashboard/error.tsx"
        code={`
'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
`}
      />
      <p>
        Two things worth calling out if you&apos;re coming from the manual React version:{" "}
        <code>error.tsx</code> <strong>must</strong> be a Client Component (error boundaries rely
        on lifecycle methods, which only exist on the client), and its second prop is{" "}
        <code>retry</code> — a function that tells Next.js to re-render the failed segment from
        scratch, rather than a boolean/counter you&apos;d manage yourself. Errors bubble up to the
        nearest parent <code>error.tsx</code>, so you can place these at whatever granularity
        makes sense: one per route, or one shared higher up the tree.
      </p>
      <p>
        <code>error.tsx</code> only catches <strong>uncaught exceptions during rendering</strong> —
        the same limitation as React error boundaries. Errors thrown inside event handlers or
        async callbacks (outside a render) still need a manual <code>try</code>/<code>catch</code>{" "}
        with local state, and <em>expected</em> errors (like a failed Server Action validation)
        are better modeled as return values consumed via <code>useActionState</code>, not thrown at
        all.
      </p>
      <p>
        For an error in the <strong>root layout</strong> itself — where there&apos;s no parent
        segment left to fall back to — use <code>global-error.tsx</code> in the root{" "}
        <code>app/</code> directory. It replaces the entire root layout when active, so it must
        define its own <code>{"<html>"}</code> and <code>{"<body>"}</code> tags:
      </p>
      <CodeBlock
        filename="app/global-error.tsx"
        code={`
'use client' // Error boundaries must be Client Components

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  )
}
`}
      />
      <p>
        The Running Example now has a real one: <code>app/todos/error.tsx</code>. It catches any
        rendering error thrown while loading or displaying the todo list — for example if the
        server store ever threw — and shows a &quot;Try again&quot; button that calls{" "}
        <code>retry()</code> to re-render just the <code>/todos</code> segment:
      </p>
      <CodeBlock
        filename="app/todos/error.tsx"
        code={`
'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function TodosError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong loading your todos.</h2>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
`}
      />
      <VueComparison>
        Nuxt&apos;s <code>error.vue</code> at the root of a project is the closest analogue to{" "}
        <code>global-error.tsx</code> — a full-app fallback. But Nuxt doesn&apos;t have a
        per-route-segment file convention the way <code>error.tsx</code> works here (nested inside
        any folder under <code>app/</code>); Nuxt error handling is generally centralized through{" "}
        <code>error.vue</code> plus <code>useError()</code>/<code>clearError()</code>, whereas
        Next.js lets you scope granular fallback UIs to exactly the route segment that failed.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Suppose <code>app/todos/[id]/error.tsx</code> also existed, in addition to{" "}
            <code>app/todos/error.tsx</code>. If a rendering error is thrown inside{" "}
            <code>app/todos/[id]/page.tsx</code>, which <code>error.tsx</code> handles it?
          </p>
        }
        solution={
          <p>
            The closer one: <code>app/todos/[id]/error.tsx</code>. Errors bubble up to the{" "}
            <em>nearest</em> parent error boundary, so a more specific segment&apos;s own{" "}
            <code>error.tsx</code> takes precedence over one further up the tree. The{" "}
            <code>app/todos/error.tsx</code> boundary would only catch errors from{" "}
            <code>app/todos/page.tsx</code> itself (or any segment below it that lacks its own,
            more specific <code>error.tsx</code>).
          </p>
        }
      />
    </Lesson>
  );
}
