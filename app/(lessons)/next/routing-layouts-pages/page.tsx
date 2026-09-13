import Link from "next/link";
import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="routing-layouts-pages" title="Routing, Layouts & Pages">
      <p>
        The previous lesson introduced the reserved filenames Next.js looks for inside each route
        segment folder. This lesson is about the two you&apos;ll use constantly: <code>page.tsx</code>{" "}
        (the UI for a route) and <code>layout.tsx</code> (UI shared across a route and its
        children).
      </p>
      <CodeBlock
        filename="app/blog/page.tsx -> renders at /blog"
        code={`
export default function Page() {
  return <h1>Blog</h1>
}
`}
      />
      <p>
        A folder alone doesn&apos;t make a URL publicly reachable — only adding a{" "}
        <code>page.tsx</code> file inside it does. This is the opposite of Nuxt, where every{" "}
        <code>.vue</code> file under <code>pages/</code> is automatically a route.
      </p>
      <p>
        <strong>Nested routes</strong> are just nested folders. <code>/blog</code> composed with a{" "}
        <code>[slug]</code> folder gives you <code>/blog/[slug]</code> — a{" "}
        <strong>dynamic route segment</strong>. Square brackets mean &quot;match anything here and
        expose it as a param&quot;:
      </p>
      <CodeBlock
        filename="app/blog/[slug]/page.tsx -> renders at /blog/hello-world, /blog/anything, ..."
        code={`
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>Post: {slug}</h1>
}
`}
      />
      <p>
        Notice <code>params</code> is a <code>Promise</code> you have to <code>await</code> — that
        matches the async-first model the rest of this Track relies on. And{" "}
        <strong>layouts</strong> nest the same way pages do: a <code>layout.tsx</code> file wraps
        every <code>page.tsx</code> below it in the folder tree via a <code>children</code> prop,
        without re-rendering when you navigate between its children.
      </p>
      <CodeBlock
        filename="app/blog/layout.tsx -- wraps every page under app/blog/"
        code={`
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <section className="blog">{children}</section>
}
`}
      />
      <p>
        <strong>New in this Next.js version — the typed-props helpers:</strong> instead of
        hand-writing <code>{"{ params }: { params: Promise<{ slug: string }> }"}</code> yourself,
        you can use the globally available <code>PageProps</code> and <code>LayoutProps</code>{" "}
        helper types. They&apos;re generated from your actual route structure by{" "}
        <code>next dev</code>/<code>next build</code>/<code>next typegen</code>, and — unusually —{" "}
        <strong>require no import at all</strong>. They just exist, like <code>fetch</code> or{" "}
        <code>console</code>:
      </p>
      <CodeBlock
        filename="app/blog/[slug]/page.tsx -- no import for PageProps"
        code={`
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <h1>Post: {slug}</h1>
}
`}
      />
      <p>
        The string literal (<code>&apos;/blog/[slug]&apos;</code>) tells the type checker exactly
        which route you&apos;re in, so it can infer the right shape for <code>params</code> (and{" "}
        <code>searchParams</code>) — and it&apos;ll error if you typo the path or reference params
        that don&apos;t exist on that route. <code>LayoutProps&lt;&apos;/dashboard&apos;&gt;</code>{" "}
        works the same way for layouts, additionally typing <code>children</code> and any named
        parallel-route slots.
      </p>
      <p>
        <strong>The Running Example gets its own real route now.</strong> This course&apos;s Todo
        app moves out of a lesson Demo and into <code>app/todos/page.tsx</code> — a genuine feature
        route, not inside the <code>(lessons)</code> group. At this point in the Track it&apos;s
        just a static list rendered straight from <code>initialTodos</code>:
      </p>
      <CodeBlock
        filename="app/todos/page.tsx (as introduced in this lesson)"
        code={`
import { initialTodos } from "@/lib/todo-app/types"

export default function TodosPage() {
  return (
    <ul>
      {initialTodos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}
`}
      />
      <p>
        Go see it running:{" "}
        <Link href="/todos" className="font-medium underline">
          /todos
        </Link>
        . Later lessons in this Track layer a detail route, client/server data fetching, and
        mutations on top of this exact file — by the time you reach the end of the Track it&apos;ll
        look considerably more capable than the snippet above.
      </p>
      <VueComparison>
        Next&apos;s folder-per-segment model with a reserved <code>page.tsx</code> filename maps to
        Nuxt&apos;s <code>pages/blog/[slug].vue</code> for dynamic routes, and nested{" "}
        <code>layout.tsx</code> files map to Nuxt&apos;s <code>layouts/</code> +{" "}
        <code>&lt;NuxtLayout&gt;</code>, though Nuxt layouts are typically singular per-page rather
        than deeply nested by folder. The <code>PageProps</code>/<code>LayoutProps</code> typed
        helpers have no real Nuxt equivalent — Nuxt&apos;s route params are typed more loosely via{" "}
        <code>useRoute().params</code>, without a route-structure-aware generator behind them.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            You want a settings section at <code>/settings</code> with sub-pages{" "}
            <code>/settings/profile</code> and <code>/settings/billing</code> that share a sidebar
            layout. What files (with paths) would you create, and which one holds the shared
            sidebar?
          </p>
        }
        solution={
          <p>
            <code>app/settings/layout.tsx</code> (the shared sidebar, wrapping{" "}
            <code>children</code>), <code>app/settings/profile/page.tsx</code>, and{" "}
            <code>app/settings/billing/page.tsx</code>. No <code>app/settings/page.tsx</code> is
            required unless you also want <code>/settings</code> itself to be directly visitable.
          </p>
        }
      />
    </Lesson>
  );
}
