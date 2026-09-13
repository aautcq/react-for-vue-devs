import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TypedTodoListDemo } from "./TypedTodoListDemo";

export default function Page() {
  return (
    <Lesson
      track="trpc"
      slug="a-typed-client-over-tanstack-query"
      title="A Typed Client, Same TanStack Query"
    >
      <p>
        This is the payoff lesson. Compare the TanStack Query Track&apos;s{" "}
        <code>useMutation</code>/<code>invalidateQueries</code> lesson against the same list built
        on tRPC — the hooks, the cache invalidation, the <code>QueryClient</code> underneath, all
        of it is unchanged. What disappears is every hand-written <code>fetch</code> call and every
        manually-annotated response type.
      </p>
      <p>The REST version from the TanStack Query Track, for reference:</p>
      <CodeBlock
        filename="app/(lessons)/tanstack-query/usemutation-and-invalidation/TodoListWithMutationsDemo.tsx (excerpt)"
        code={`
async function postTodo(text: string): Promise<Todo> {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('Failed to add todo')
  return res.json() // <- Todo asserted here, not checked
}

const queryClient = useQueryClient()
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })
const addMutation = useMutation({
  mutationFn: postTodo,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})

addMutation.mutate('Buy milk') // any string compiles, even ''
`}
      />
      <p>And the tRPC version, doing the same job:</p>
      <CodeBlock
        filename="app/(lessons)/trpc/a-typed-client-over-tanstack-query/TypedTodoListDemo.tsx (excerpt)"
        code={`
const trpc = useTRPC()
const queryClient = useQueryClient()

const { data } = useQuery(trpc.list.queryOptions())
const addMutation = useMutation(
  trpc.add.mutationOptions({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trpc.list.queryKey() }),
  })
)

addMutation.mutate({ text: 'Buy milk' }) // shape checked; '' rejected by the server's zod schema
`}
      />
      <p>
        There&apos;s no <code>postTodo</code> function to write, no <code>res.ok</code> check to
        remember, no <code>res.json()</code> cast to a type that might be wrong. <code>data</code>{" "}
        above is inferred as <code>Todo[]</code> straight from <code>todoRouter</code>&apos;s{" "}
        <code>list</code> procedure; <code>addMutation.mutate</code> only accepts{" "}
        <code>&#123; text: string &#125;</code> because that&apos;s <code>add</code>&apos;s{" "}
        <code>.input()</code> schema. <code>trpc.list.queryKey()</code> replaces the{" "}
        <code>[&quot;todos&quot;]</code> string array with a key tRPC derives from the procedure
        itself — spelling it wrong isn&apos;t possible the way mistyping{" "}
        <code>[&quot;todo&quot;]</code> in the REST version silently would be.
      </p>
      <p>Same list, same mutations, same TanStack Query cache, all fully typed:</p>
      <Demo title="add, toggle, and delete via trpc.*.mutationOptions(), invalidating trpc.list.queryKey()">
        <TypedTodoListDemo />
      </Demo>
      <p>
        Everything under the hood is still <code>@tanstack/react-query</code> —{" "}
        <code>useQuery</code>, <code>useMutation</code>, <code>useQueryClient</code>,{" "}
        <code>invalidateQueries</code>, the same <code>isPending</code>/<code>isError</code> states
        from the earlier lessons. <code>@trpc/tanstack-react-query</code> doesn&apos;t replace any
        of that; <code>trpc.list.queryOptions()</code> and{" "}
        <code>trpc.add.mutationOptions(&#123;...&#125;)</code> just return the same options objects
        you&apos;d otherwise write by hand for <code>useQuery</code>/<code>useMutation</code>, with
        <code>queryFn</code>/<code>mutationFn</code> and the query key already filled in from the
        router&apos;s types.
      </p>
      <VueComparison>
        No direct Nuxt/Pinia equivalent has this level of inference out of the box. The closest
        conceptual parallel is a fully-typed Nitro route consumed through a generated or
        hand-inferred composable — technically possible with enough <code>$fetch&lt;T&gt;()</code>{" "}
        generic annotations and shared types imported across the client/server boundary — but most
        Nuxt apps don&apos;t actually set this up, because Nuxt has no built-in mechanism that ties
        a server route&apos;s input/output types to a client call the way a tRPC router&apos;s
        <code>AppRouter</code> type does automatically.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            The REST version&apos;s <code>postTodo</code> casts <code>res.json()</code> to{" "}
            <code>Todo</code> with no runtime check. If the server-store&apos;s <code>addTodo</code>{" "}
            were changed to return <code>&#123; id, text, done, createdAt &#125;</code> (an added
            field) but the REST Route Handler forgot to update its response shape assumptions
            elsewhere, would TypeScript catch the mismatch in the REST Demo? Would it catch an
            equivalent mismatch in the tRPC Demo?
          </p>
        }
        solution={
          <p>
            In the REST Demo: no. <code>res.json()</code> returns <code>any</code>, and asserting
            it <code>as Todo</code> (or letting a <code>Promise&lt;Todo&gt;</code> return type do
            the same thing implicitly) tells TypeScript to trust you — it doesn&apos;t verify
            anything about the actual response shape at compile time or runtime. In the tRPC Demo:
            yes, automatically, with no extra work. <code>addTodo</code>&apos;s return type flows
            through <code>todoRouter</code> into <code>AppRouter</code>; <code>trpc.add</code>&apos;s
            inferred output type updates the moment the server function&apos;s signature changes,
            so any client code that destructures a field the new shape no longer has (or fails to
            account for one it now does) is a type error the next time you compile — not a bug
            you discover in production.
          </p>
        }
      />
    </Lesson>
  );
}
