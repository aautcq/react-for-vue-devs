import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="trpc" slug="routers-and-procedures" title="Routers & Procedures">
      <p>
        Both the Next Track&apos;s Server Actions and the TanStack Query Track&apos;s{" "}
        <code>/api/todos</code> Route Handler share one limitation: the connection between what the
        server returns and what the client expects is only as reliable as your hand-written types.
        Nothing stops the Route Handler from renaming a field, or the client from typing the
        response wrong — the contract lives in your head, not in the compiler. tRPC closes that
        gap by making the server&apos;s own function signatures <em>be</em> the contract.
      </p>
      <p>
        Everything starts with <code>initTRPC.create()</code>, which builds a backend instance you
        use to construct <code>router</code>s and <code>procedure</code>s:
      </p>
      <CodeBlock
        filename="lib/trpc/init.ts"
        code={`
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure
`}
      />
      <p>
        A <strong>Procedure</strong> is a single typed operation — a query or a mutation — analogous
        to one exported function in a Route Handler, but with its input and output types inferred
        instead of hand-written. <code>.query()</code> is for reads (no side effects expected);{" "}
        <code>.mutation()</code> is for writes. A <strong>router</strong> is just a named collection
        of procedures. The Running Example&apos;s real router looks like this:
      </p>
      <CodeBlock
        filename="lib/trpc/router.ts"
        code={`
import { z } from 'zod'
import { addTodo, deleteTodo, getTodos, toggleTodo } from '@/lib/todo-app/server-store'
import { publicProcedure, router } from './init'

export const todoRouter = router({
  list: publicProcedure.query(() => getTodos()),
  add: publicProcedure
    .input(z.object({ text: z.string().min(1, "Todo text can't be empty.") }))
    .mutation(({ input }) => addTodo(input.text)),
  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => toggleTodo(input.id)),
  remove: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => deleteTodo(input.id)),
})

export type AppRouter = typeof todoRouter
`}
      />
      <p>
        Notice <code>list</code> just calls <code>getTodos()</code> — the same server-store
        function the <code>/api/todos</code> Route Handler and the Server Actions call. tRPC
        isn&apos;t a new data layer; it&apos;s a typed shell around the data layer you already have.
        The one export that matters most is the last line: <code>AppRouter</code>. It&apos;s
        never sent to the client — it&apos;s a compile-time-only type — but importing it is enough
        for a client to know, statically, that <code>list</code> returns <code>Todo[]</code>, that{" "}
        <code>add</code> requires a <code>&#123; text: string &#125;</code> input, and that{" "}
        <code>toggle</code>/<code>remove</code> require a <code>&#123; id: string &#125;</code>. Rename
        a field on the server and every client call site that used it turns red — no waiting for a
        runtime response to find out.
      </p>
      <VueComparison>
        The closest Nuxt equivalent is a typed composable wrapping <code>$fetch</code> to a{" "}
        <code>server/api/*.ts</code> route — Nitro can even infer the response type of a{" "}
        <code>server/api/todos.get.ts</code> handler when you call it through <code>$fetch</code> in
        the same project. But that inference stops at the shape of one endpoint&apos;s return value;
        Nuxt has no equivalent of an <code>AppRouter</code> type that bundles every procedure&apos;s
        full input <em>and</em> output together, importable as one unit on the client. That
        end-to-end inference — one type import, the whole API surface typed — is tRPC&apos;s core
        value proposition, and it&apos;s worth sitting with: nothing is generated, no build step
        parses your routes into a schema file. It&apos;s just TypeScript inferring types through a
        function call, the same as any other typed function in your codebase.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Why is <code>list</code> defined with <code>.query()</code> instead of{" "}
            <code>.mutation()</code>, even though nothing stops you from writing{" "}
            <code>publicProcedure.mutation(() =&gt; getTodos())</code> and having it work
            identically at runtime?
          </p>
        }
        solution={
          <p>
            <code>.query()</code> vs <code>.mutation()</code> doesn&apos;t change what a procedure
            can do at the network level — both are just typed functions tRPC can call. The
            distinction is about intent and client-side behavior: TanStack Query (and tRPC&apos;s
            React bindings) treat queries as cacheable, deduplicatable, safe-to-retry reads, exposed
            via <code>useQuery</code>/<code>queryOptions</code>. Mutations are exposed via{" "}
            <code>useMutation</code>/<code>mutationOptions</code> instead, which has no caching or
            automatic retry/refetch-on-mount behavior, because writes generally shouldn&apos;t be
            deduplicated or silently re-run. Marking <code>list</code> as a mutation would make it
            impossible to use it with <code>useQuery</code> at all — the type wouldn&apos;t line up.
          </p>
        }
      />
    </Lesson>
  );
}
