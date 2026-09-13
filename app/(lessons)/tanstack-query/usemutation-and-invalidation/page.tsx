import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoListWithMutationsDemo } from "./TodoListWithMutationsDemo";

export default function Page() {
  return (
    <Lesson
      track="tanstack-query"
      slug="usemutation-and-invalidation"
      title="useMutation & Cache Invalidation"
    >
      <p>
        The Next Track&apos;s Server Actions mutate the Running Example by calling{" "}
        <code>revalidatePath(&quot;/todos&quot;)</code> — telling Next.js &quot;this Server
        Component needs to re-render with fresh data.&quot; A Client Component has no{" "}
        <code>revalidatePath</code> to call; instead, <code>useMutation</code> wraps the write
        itself, and on success you tell the <code>QueryClient</code> which cached{" "}
        <code>queryKey</code>s are now stale:
      </p>
      <CodeBlock
        filename="the useMutation contract"
        code={`
const queryClient = useQueryClient()

const addMutation = useMutation({
  mutationFn: postTodo, // (text: string) => Promise<Todo>
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
})

// later:
addMutation.mutate("Buy milk")
`}
      />
      <p>
        <code>invalidateQueries</code> marks the <code>[&quot;todos&quot;]</code> entry stale and
        triggers a background refetch of anything currently subscribed to it — which is exactly the{" "}
        <code>useQuery</code> from the previous lesson. Mutate through <code>postTodo</code>,
        invalidate, and the read side updates itself; no manual cache-poking, no prop drilling a{" "}
        <code>setTodos</code> down to whatever triggered the mutation.
      </p>
      <p>
        All three mutations here hit the same <code>/api/todos</code> Route Handler from the
        Route Handlers lesson — now extended with <code>POST</code>/<code>PATCH</code>/
        <code>DELETE</code>, reading and writing the very same <code>lib/todo-app/server-store</code>{" "}
        the Server Actions use. One source of truth, three ways to reach it:
      </p>
      <CodeBlock
        filename="app/(lessons)/tanstack-query/usemutation-and-invalidation/TodoListWithMutationsDemo.tsx (excerpt)"
        code={`
async function postTodo(text: string): Promise<Todo> {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error("Failed to add todo")
  return res.json()
}
`}
      />
      <Demo title="add, toggle, and delete — each a useMutation invalidating the same query">
        <TodoListWithMutationsDemo />
      </Demo>
      <VueComparison>
        Nuxt has no <code>useMutation</code> built in — a Nuxt app typically calls{" "}
        <code>$fetch</code> directly inside the handler and then either calls{" "}
        <code>refreshNuxtData(key)</code> (the closest analog to <code>invalidateQueries</code>) or
        manually pushes the new item into a local ref. <code>@tanstack/vue-query</code> brings this
        exact <code>useMutation</code> + <code>invalidateQueries</code> pattern to Vue apps that want
        it, with the same API shown here.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            If <code>onSuccess</code> on the toggle mutation called{" "}
            <code>queryClient.invalidateQueries(&#123; queryKey: [&quot;todos&quot;] &#125;)</code>,
            and three different components on the page each had their own{" "}
            <code>useQuery(&#123; queryKey: [&quot;todos&quot;] &#125;)</code>, how many network
            requests does that one invalidation trigger?
          </p>
        }
        solution={
          <p>
            One — not three. <code>invalidateQueries</code> marks the cache entry stale and
            refetches it once; every component subscribed to that same <code>queryKey</code> then
            re-renders from that single shared result once it resolves. This is the same
            deduplication from the first lesson, just triggered by a mutation instead of multiple
            simultaneous mounts.
          </p>
        }
      />
    </Lesson>
  );
}
