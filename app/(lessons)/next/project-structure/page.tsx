import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="project-structure" title="Project Structure & Conventions">
      <p>
        Next.js uses <strong>file-system based routing</strong> inside the <code>app/</code>{" "}
        directory. Folders define URL segments; specific filenames inside a folder are reserved
        conventions that Next.js picks up automatically:
      </p>
      <CodeBlock
        filename="reserved files, per route segment"
        code={`
page.tsx          -> makes the segment publicly routable, this is the UI
layout.tsx        -> shared UI wrapping this segment + its children
loading.tsx       -> instant loading skeleton (Suspense boundary)
error.tsx         -> error boundary for this segment
not-found.tsx     -> not-found UI for this segment
route.ts          -> an API endpoint instead of a page (mutually exclusive with page.tsx)
`}
      />
      <p>
        This course itself is a working example. This lesson lives at{" "}
        <code>{"app/(lessons)/next/project-structure/page.tsx"}</code>, which maps to the URL{" "}
        <code>/next/project-structure</code>:
      </p>
      <CodeBlock
        filename="this repo's app/ directory (abridged)"
        code={`
app/
  page.tsx                          -> "/"              (the course landing page)
  layout.tsx                        -> root layout (html/body, fonts)
  (lessons)/
    layout.tsx                      -> shared sidebar, wraps every lesson below
    react/
      jsx-and-rendering/page.tsx    -> "/react/jsx-and-rendering"
      ...
    next/
      project-structure/page.tsx    -> "/next/project-structure"  (this page)
      ...
`}
      />
      <p>
        Notice the parentheses around <code>(lessons)</code>. That&apos;s a{" "}
        <strong>route group</strong>: it lets <code>react/</code> and <code>next/</code> share one
        layout (the sidebar) without the literal word &quot;lessons&quot; appearing in the URL.
        Route groups are purely organizational — they never affect the URL path.
      </p>
      <VueComparison>
        Nuxt&apos;s <code>pages/</code> directory does the same file-to-route mapping (e.g.{" "}
        <code>pages/blog/[slug].vue</code> → <code>/blog/:slug</code>), and Nuxt layouts
        (<code>layouts/default.vue</code>) are conceptually the same as Next&apos;s{" "}
        <code>layout.tsx</code>. The one-directory-per-route-segment shape with a reserved{" "}
        <code>page</code> filename is new if you&apos;re used to Nuxt inferring a route from a
        single <code>.vue</code> file&apos;s path — here, a route is a <em>folder</em>, and what&apos;s
        routable inside it depends on which reserved filenames you add.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            This course&apos;s Todo running example will get its own route later in this Track. If
            you wanted it at <code>/todos</code>, plus a details page at{" "}
            <code>/todos/[id]</code>, what two files (with paths) would you need to create at
            minimum?
          </p>
        }
        solution={
          <p>
            <code>app/todos/page.tsx</code> for the list at <code>/todos</code>, and{" "}
            <code>app/todos/[id]/page.tsx</code> for the dynamic detail route at{" "}
            <code>/todos/&lt;id&gt;</code>. No new layout is required — both would still inherit
            the root layout (and, if placed inside the <code>(lessons)</code> group, the sidebar
            too).
          </p>
        }
      />
    </Lesson>
  );
}
