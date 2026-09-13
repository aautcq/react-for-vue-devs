import Link from "next/link";
import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="server-and-client-components" title="Server vs Client Components">
      <p>
        Every layout and page you&apos;ve written so far in this Track has been a{" "}
        <strong>Server Component</strong> — that&apos;s the default, not something you opted into.
        Server Components can be <code>async</code>, read data directly (a database call, a{" "}
        <code>fetch</code>, the filesystem), and — critically — <strong>never ship their code to
        the browser</strong>. Only their rendered output does.
      </p>
      <p>
        You reach for a <strong>Client Component</strong> only when you need something a Server
        Component structurally can&apos;t do:
      </p>
      <CodeBlock
        filename="reasons to add 'use client'"
        code={`
State and event handlers   -> useState, onClick, onChange
Lifecycle logic            -> useEffect
Browser-only APIs          -> localStorage, window, navigator.geolocation
Custom hooks that use any of the above
`}
      />
      <p>
        You opt in with the <code>&quot;use client&quot;</code> directive at the very top of a
        file, above the imports:
      </p>
      <CodeBlock
        filename="app/ui/counter.tsx"
        code={`
"use client"

import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
`}
      />
      <p>
        <code>&quot;use client&quot;</code> marks a <strong>boundary</strong>, not just one
        component: once a file has it, every component it imports and directly renders is bundled
        for the client too. That&apos;s why the common pattern is to keep the directive on the
        smallest possible leaf component — a search box, a like button, a form — and let everything
        around it stay a Server Component. This <em>is</em> the pattern this whole course uses:
        every lesson&apos;s <code>page.tsx</code> is an un-annotated Server Component (it even
        renders the <code>async</code> <code>{"<CodeBlock>"}</code> you&apos;re reading right now),
        while any interactive Demo lives in a colocated file starting with{" "}
        <code>&quot;use client&quot;</code> — see e.g.{" "}
        <code>app/(lessons)/react/useeffect-and-side-effects/TodoDemo.tsx</code> from the React
        Track.
      </p>
      <p>
        <strong>Extending the Running Example:</strong> <code>app/todos/page.tsx</code> stays a
        Server Component rendering the list, and gets a small colocated Client Component for the
        one genuinely interactive piece — the add-todo input:
      </p>
      <CodeBlock
        filename="app/todos/AddTodoForm.tsx (interactivity only, no data yet)"
        code={`
"use client"

import { useState } from "react"

export function AddTodoForm() {
  const [text, setText] = useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // No backend wired up yet — that's the Fetching Data and
        // Mutating Data / Server Actions lessons, coming up next.
        setText("")
      }}
    >
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  )
}
`}
      />
      <p>
        Notice what this component <em>can&apos;t</em> do yet: it can&apos;t reach into{" "}
        <code>app/todos/page.tsx</code>&apos;s server-rendered list and append to it directly.
        Server Components can&apos;t be re-invoked from the client, and a Server Component can&apos;t
        hand a Client Component a plain callback function as a prop either — functions aren&apos;t
        serializable across that boundary. The only sanctioned way to mutate server-held state from
        a Client Component is a <strong>Server Action</strong>, which is exactly what the Mutating
        Data lesson wires up. Check{" "}
        <Link href="/todos" className="font-medium underline">
          /todos
        </Link>{" "}
        now versus after that lesson — same files, very different capability.
      </p>
      <VueComparison>
        Nuxt&apos;s universal rendering runs (almost) the same component code on both server and
        client, and you opt a specific component <em>out</em> of one environment with a{" "}
        <code>.client.vue</code> or <code>.server.vue</code> suffix — an escape hatch, used
        rarely. Next.js inverts this: Server Components are the default and non-negotiable (their
        code never reaches the browser at all, it&apos;s not just &quot;skipped&quot;), and you opt
        a component <em>into</em> the client explicitly and constantly, since anything stateful or
        interactive needs it.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A <code>{"<ProductPage>"}</code> Server Component fetches product data and renders a{" "}
            <code>{"<AddToCartButton>"}</code>. The button needs an <code>onClick</code> handler
            and local &quot;adding…&quot; state. Where does <code>&quot;use client&quot;</code> go
            — on <code>ProductPage</code>, on <code>AddToCartButton</code>, or both — and why?
          </p>
        }
        solution={
          <p>
            Only on <code>AddToCartButton</code>. Marking <code>ProductPage</code> as a Client
            Component too would be unnecessary and costly — it would ship the whole page&apos;s
            code to the browser and lose the ability to fetch data directly on the server. Keeping{" "}
            <code>&quot;use client&quot;</code> on just the button (a leaf component) means only
            that small piece is bundled for the client, while the surrounding page stays a Server
            Component that can pass the fetched product data down as a prop.
          </p>
        }
      />
    </Lesson>
  );
}
