import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { RevalidationDemo } from "./RevalidationDemo";

export default function Page() {
  return (
    <Lesson track="next" slug="revalidating" title="Revalidating">
      <p>
        The previous lesson covered <strong>caching</strong>: this repo doesn&apos;t enable the
        newer Cache Components model (<code>cacheComponents: true</code> in{" "}
        <code>next.config.ts</code>), so it uses the &quot;previous model&quot; described in the
        docs — <code>fetch</code> requests can opt into caching with{" "}
        <code>{"{ cache: 'force-cache' }"}</code> or a <code>next.tags</code> tag, and non-fetch
        data (like our in-memory Todo store) can be memoized with{" "}
        <code>unstable_cache</code>. Either way, once something is cached, Next.js needs to be told
        <em> when</em> that cache is stale. That&apos;s revalidation.
      </p>
      <p>
        There are two on-demand APIs, both importable from <code>next/cache</code> and both only
        callable from a <strong>Server Action</strong> or a <strong>Route Handler</strong> (never
        from a Server Component render):
      </p>
      <CodeBlock
        filename="the two on-demand revalidation APIs"
        code={`
import { revalidateTag, revalidatePath } from 'next/cache'

// Invalidate every cached read tagged 'todos', wherever it's used.
revalidateTag('todos')

// Invalidate every cached render of one route path, without needing to know its tags.
revalidatePath('/todos')
`}
      />
      <p>
        <code>revalidateTag</code> is the more precise tool — tag a cached read once, then any
        action that changes that data calls <code>revalidateTag</code> with the same string.{" "}
        <code>revalidatePath</code> is the blunter, know-nothing-about-tags option: &quot;whatever
        this path renders, throw its cache away and re-render it next request.&quot; (The newer
        Cache Components model adds a third option, <code>updateTag</code>, for when a user needs
        to see <em>their own</em> write immediately rather than tolerating a brief
        stale-while-revalidate window — not needed here since our data isn&apos;t cached long
        enough for that to matter.)
      </p>
      <p>
        Tying this to the Running Example: once <code>app/todos/page.tsx</code> exists, toggling a
        todo will go through a Server Action in <code>lib/todo-app/actions.ts</code> that calls the
        server-store mutator and then <code>revalidatePath(&apos;/todos&apos;)</code>. Without that
        call, the mutation would succeed in the store, but anyone re-visiting <code>/todos</code>{" "}
        could still see the old, cached list — revalidation is the missing link between
        &quot;the data changed&quot; and &quot;the UI reflects it.&quot;
      </p>
      <CodeBlock
        filename="lib/todo-app/actions.ts (shape once the Running Example wires this up)"
        code={`
'use server'

import { revalidatePath } from 'next/cache'
import { toggleTodo } from './server-store'

export async function toggleTodoAction(id: string) {
  await toggleTodo(id)
  revalidatePath('/todos')
}
`}
      />
      <p>
        The demo below is a <strong>simplified, conceptual</strong> stand-in — plain client state,
        no server, no cache — just to build intuition for &quot;a view can lag behind its source
        until something explicitly tells it to catch up&quot;:
      </p>
      <Demo title="conceptual stale-vs-revalidated view (not real Next.js caching)">
        <RevalidationDemo />
      </Demo>
      <VueComparison>
        Nuxt&apos;s closest analogue is <code>refreshNuxtData()</code> /{" "}
        <code>clearNuxtData()</code>, which force a <code>useFetch</code>/<code>useAsyncData</code>{" "}
        composable to refetch, or Nitro&apos;s cache storage invalidation for server routes. The
        shape is similar — &quot;this data is cached, tell it to go fetch fresh&quot; — but
        Next&apos;s <code>revalidateTag</code>/<code>revalidatePath</code> are called from the{" "}
        <em>mutation site</em> (a Server Action) rather than the <em>consuming</em> component,
        which is the more novel part if you&apos;re used to composables owning their own refresh.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A todo-deletion Server Action calls <code>deleteTodo(id)</code> against the store but
            forgets to call <code>revalidatePath</code> or <code>revalidateTag</code> afterward.
            The store itself updates correctly. What will a user see if they immediately navigate
            back to <code>/todos</code>?
          </p>
        }
        solution={
          <p>
            If <code>/todos</code>&apos; data was cached, they&apos;d likely still see the deleted
            todo — the underlying store changed, but Next.js has no reason to know the cached
            render (or cached <code>fetch</code>/<code>unstable_cache</code> read) is now stale, so
            it keeps serving the old cached output until it naturally expires or is explicitly
            revalidated.
          </p>
        }
      />
    </Lesson>
  );
}
