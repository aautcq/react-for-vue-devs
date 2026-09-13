import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoListReadOnlyDemo } from "./TodoListReadOnlyDemo";

export default function Page() {
  return (
    <Lesson track="tanstack-query" slug="usequery-for-todos" title="useQuery for the Todo List">
      <p>
        The <code>/todos</code> route from the Next Track renders the Running Example server-side:
        an <code>async</code> Server Component calls <code>getTodos()</code> directly, and the
        finished HTML is what the browser receives. This lesson builds the same list a different
        way — as a <strong>Client Component</strong> that fetches <code>/api/todos</code> itself via{" "}
        <code>useQuery</code>, and re-renders on its own whenever that cache entry changes:
      </p>
      <CodeBlock
        filename="app/(lessons)/tanstack-query/usequery-for-todos/TodoListReadOnlyDemo.tsx (excerpt)"
        code={`
async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos")
  if (!res.ok) throw new Error("Failed to fetch todos")
  return res.json()
}

function TodoListReadOnly() {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  })

  if (isPending) return <p>Loading…</p>
  if (isError) return <p>Something went wrong.</p>

  return (
    <ul>
      {data.map((todo) => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  )
}
`}
      />
      <p>
        <code>isPending</code>/<code>isError</code>/<code>data</code> replace what would otherwise
        be three separate <code>useState</code> calls plus a <code>useEffect</code> — and unlike a
        hand-rolled effect, this cache entry is keyed by <code>[&quot;todos&quot;]</code>, so any
        other component mounting the same query reuses it instead of firing a second request.
      </p>
      <p>
        The <strong>Refetch</strong> button below calls <code>refetch()</code> directly, forcing a
        fresh round-trip to <code>/api/todos</code> without remounting the component — something a
        plain <code>useEffect</code> fetch has no equivalent for without extra state to track a
        &quot;refetch trigger&quot;:
      </p>
      <Demo title="a Client Component reading /api/todos via useQuery">
        <TodoListReadOnlyDemo />
      </Demo>
      <p>
        This list is read-only for now — no add/toggle/remove yet. The next lesson wires those up
        with <code>useMutation</code>, invalidating this same <code>[&quot;todos&quot;]</code> cache
        entry so the list here and the mutation both stay in sync.
      </p>
      <VueComparison>
        Structurally this is the same shape as Nuxt&apos;s <code>useAsyncData</code>:{" "}
        <code>data</code>/<code>pending</code>/<code>error</code> refs plus a <code>refresh()</code>{" "}
        function. The difference shows up once two components need the <em>same</em> data — Nuxt
        dedupes by the key string you pass to <code>useAsyncData</code>, exactly like TanStack
        Query&apos;s <code>queryKey</code> array, so the mental model transfers almost one-to-one.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Suppose you navigate away from this lesson and back. Does <code>TodoListReadOnlyDemo</code>{" "}
            refetch <code>/api/todos</code> on remount, given the query was already cached from the
            first visit? What TanStack Query concept controls this?
          </p>
        }
        solution={
          <p>
            It depends on the query&apos;s <strong>staleness</strong>. By default, TanStack Query
            treats cached data as stale immediately (<code>staleTime: 0</code>), so remounting a
            component that uses an already-cached query key triggers a background refetch — but it
            renders the cached data instantly first (no loading flash) while that refetch happens.
            Setting a longer <code>staleTime</code> on the query would skip the refetch until that
            time has elapsed.
          </p>
        }
      />
    </Lesson>
  );
}
