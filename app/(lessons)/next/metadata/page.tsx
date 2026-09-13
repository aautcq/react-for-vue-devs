import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="metadata" title="Metadata & OG Images">
      <p>
        Next.js generates a route&apos;s <code>{"<head>"}</code> tags for you, driven by exports
        from your <code>page.tsx</code> or <code>layout.tsx</code> files rather than JSX you write
        by hand. There are two ways to define it: a <strong>static</strong>{" "}
        <code>metadata</code> object, or a <strong>dynamic</strong> <code>generateMetadata</code>{" "}
        function — both are only supported in Server Components.
      </p>
      <CodeBlock
        filename="static metadata"
        code={`
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: '...',
}

export default function Layout() {}
`}
      />
      <p>
        Use <code>generateMetadata</code> instead when the metadata depends on data you have to
        fetch — for example a dynamic route&apos;s <code>params</code>. It receives the same{" "}
        <code>params</code>/<code>searchParams</code> props as the page and returns a{" "}
        <code>Metadata</code> object:
      </p>
      <CodeBlock
        filename="dynamic metadata"
        code={`
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await fetch(\`https://api.vercel.app/blog/\${slug}\`).then((res) => res.json())

  return {
    title: post.title,
    description: post.description,
  }
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {}
`}
      />
      <p>
        Tying this to the Running Example: once <code>app/todos/page.tsx</code> and{" "}
        <code>app/todos/[id]/page.tsx</code> exist, they&apos;d export metadata like this — a
        static title on the list page, and a <code>generateMetadata</code> function on the detail
        page since the title depends on which todo&apos;s <code>id</code> was requested:
      </p>
      <CodeBlock
        filename="app/todos/page.tsx (metadata export, shape once this route exists)"
        code={`
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Todos',
  description: 'The Running Example: a small todo list built up across this course.',
}
`}
      />
      <CodeBlock
        filename="app/todos/[id]/page.tsx (metadata export, shape once this route exists)"
        code={`
import type { Metadata } from 'next'
import { getTodos } from '@/lib/todo-app/server-store'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const todos = await getTodos()
  const todo = todos.find((t) => t.id === id)

  return {
    title: todo ? todo.text : 'Todo not found',
  }
}
`}
      />
      <p>
        Beyond the two function/object exports, Next.js also supports{" "}
        <strong>file-based metadata</strong> — drop a <code>favicon.ico</code>,{" "}
        <code>opengraph-image.jpg</code>, <code>robots.txt</code>, or <code>sitemap.xml</code>{" "}
        into a route folder and it&apos;s picked up automatically. For OG images that depend on
        data (like a per-todo social preview), you can generate one at request/build time with the{" "}
        <code>ImageResponse</code> constructor from <code>next/og</code>, writing the image as JSX
        and CSS instead of a static file.
      </p>
      <VueComparison>
        Nuxt&apos;s <code>useHead()</code> composable is the closest match to imperatively setting
        tags, and <code>definePageMeta()</code> lets a page declare route-level metadata similar to
        Next&apos;s static <code>metadata</code> export. The static-vs-dynamic split maps roughly
        onto <code>definePageMeta</code> (static, compile-time-ish) vs calling{" "}
        <code>useHead()</code> inside <code>useAsyncData</code>&apos;s resolution (dynamic, needs
        fetched data) — but Next keeps them as two distinct, non-overlapping export shapes
        (<code>metadata</code> object vs <code>generateMetadata</code> function) rather than one
        composable used either way.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Why does <code>app/todos/[id]/page.tsx</code> need{" "}
            <code>generateMetadata</code> instead of a static <code>metadata</code> export, while{" "}
            <code>app/todos/page.tsx</code> can use the static form?
          </p>
        }
        solution={
          <p>
            The list page&apos;s title (&quot;Todos&quot;) is the same on every visit — no data
            dependency, so a plain static object works. The detail page&apos;s title depends on{" "}
            <em>which</em> todo was requested (its <code>id</code> route param), which is only
            known at request time and requires looking the todo up — that&apos;s exactly what{" "}
            <code>generateMetadata</code> exists for: an async function that can read{" "}
            <code>params</code> and fetch/compute a result before Next.js renders the{" "}
            <code>{"<head>"}</code>.
          </p>
        }
      />
    </Lesson>
  );
}
