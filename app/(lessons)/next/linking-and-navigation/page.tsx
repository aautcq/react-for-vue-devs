import Link from "next/link";
import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="linking-and-navigation" title="Linking & Navigation">
      <p>
        Every route in Next.js is <strong>server-rendered by default</strong>: a Server Component
        Payload is generated on the server for both the first visit and every later navigation.
        Naively, that would mean a network round-trip on every click. Next.js avoids that with{" "}
        <strong>prefetching</strong>, <strong>streaming</strong>, and{" "}
        <strong>client-side transitions</strong> — all triggered by one component.
      </p>
      <CodeBlock
        filename="the <Link> component"
        code={`
import Link from "next/link"

<Link href="/blog">Blog</Link>       {/* prefetched on hover/viewport */}
<a href="/contact">Contact</a>       {/* plain <a>: no prefetching */}
`}
      />
      <p>
        <code>{"<Link>"}</code> extends the HTML <code>{"<a>"}</code> tag. As soon as a{" "}
        <code>{"<Link>"}</code> enters the viewport (or is hovered), Next.js fetches the target
        route&apos;s data in the background — a <strong>static</strong> route&apos;s whole payload
        is prefetched, while a <strong>dynamic</strong> route is skipped or partially prefetched.
        By the time the user actually clicks, the data is often already sitting client-side, so the
        navigation feels instant even though it&apos;s still a server-rendered route under the
        hood. Regular <code>{"<a>"}</code> tags get none of this and always trigger a full page
        load.
      </p>
      <p>
        For navigation you trigger from code rather than a click — after a form submits, inside an
        event handler, etc. — use the <code>useRouter</code> hook from a Client Component. To read
        the current URL without navigating, use <code>usePathname</code>:
      </p>
      <CodeBlock
        filename="app/ui/nav-example.tsx"
        code={`
"use client"

import { useRouter, usePathname } from "next/navigation"

export function NavExample() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <button onClick={() => router.push("/todos")}>
      Currently on {pathname} — go to /todos
    </button>
  )
}
`}
      />
      <p>
        <strong>Extending the Running Example:</strong> <code>/todos</code> now gets a per-todo
        detail route at <code>app/todos/[id]/page.tsx</code>, using the same{" "}
        <code>PageProps</code> helper from the last lesson, this time keyed to a dynamic segment:
      </p>
      <CodeBlock
        filename="app/todos/[id]/page.tsx"
        code={`
import { notFound } from "next/navigation"
import { initialTodos } from "@/lib/todo-app/types"

export default async function TodoDetailPage(props: PageProps<'/todos/[id]'>) {
  const { id } = await props.params
  const todo = initialTodos.find((t) => t.id === id)
  if (!todo) notFound()

  return <h1>{todo.text}</h1>
}
`}
      />
      <p>
        And each row in <code>app/todos/page.tsx</code> now links to its own detail page instead of
        rendering plain text:
      </p>
      <CodeBlock
        filename="app/todos/page.tsx (row, updated)"
        code={`
<Link href={\`/todos/\${todo.id}\`}>{todo.text}</Link>
`}
      />
      <p>
        Try it — hover a row on{" "}
        <Link href="/todos" className="font-medium underline">
          /todos
        </Link>{" "}
        before clicking and the detail page should feel immediate, since Next.js already prefetched
        it once the link entered the viewport.
      </p>
      <VueComparison>
        <code>{"<Link>"}</code> is Next&apos;s <code>&lt;NuxtLink&gt;</code> — both wrap the native
        anchor, both prevent a full page reload, and both prefetch by default (Nuxt does it on
        viewport visibility too). <code>useRouter</code>/<code>usePathname</code> map to Vue
        Router&apos;s <code>useRouter</code>/<code>useRoute().path</code>, though Next splits
        &quot;router&quot; and &quot;current path&quot; into two hooks instead of bundling
        everything onto one route object.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A page renders 500 <code>{"<Link>"}</code> rows in a virtualized list (e.g. an infinite
            scroll table). Why might prefetching all of them be wasteful, and what prop would you
            set on each <code>{"<Link>"}</code> to avoid it — trading off what?
          </p>
        }
        solution={
          <p>
            Prefetching every visible link means potentially hundreds of background requests for
            routes the user will likely never click. Set <code>prefetch=&#123;false&#125;</code> to
            disable prefetching entirely, or prefetch only on hover with{" "}
            <code>prefetch=&#123;active ? null : false&#125;</code> toggled by{" "}
            <code>onMouseEnter</code>. The trade-off: static routes now only fetch on click instead
            of instantly, and dynamic routes must render server-side before the client can navigate
            — slightly slower navigation in exchange for far less wasted network/server work.
          </p>
        }
      />
    </Lesson>
  );
}
