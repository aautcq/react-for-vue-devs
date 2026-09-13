import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { RouteHandlerDemo } from "./RouteHandlerDemo";

export default function Page() {
  return (
    <Lesson track="next" slug="route-handlers" title="Route Handlers">
      <p>
        Every reserved filename so far — <code>page.tsx</code>, <code>layout.tsx</code>,{" "}
        <code>error.tsx</code> — renders UI. <code>route.ts</code> is different: it makes the
        segment an <strong>API endpoint</strong> instead of a page, using the Web{" "}
        <code>Request</code>/<code>Response</code> APIs directly. A <code>route.ts</code> file
        exports named functions per HTTP method — <code>GET</code>, <code>POST</code>,{" "}
        <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>, <code>HEAD</code>,{" "}
        <code>OPTIONS</code> — and Next.js calls whichever one matches the incoming request:
      </p>
      <CodeBlock
        filename="app/api/route.ts"
        code={`
export async function GET(request: Request) {}
`}
      />
      <p>
        A <code>route.ts</code> file <strong>cannot</strong> coexist with a <code>page.tsx</code>{" "}
        in the same segment — a segment is either a page or an endpoint, never both. Nested
        segments are fine, though: <code>app/api/todos/route.ts</code> lives happily alongside{" "}
        <code>app/todos/page.tsx</code>, since they&apos;re different segments.
      </p>
      <p>
        <strong>Caching:</strong> Route Handlers are dynamic (uncached) by default — every request
        re-runs the function. A <code>GET</code> handler can opt into caching with a route config
        option like <code>export const dynamic = &apos;force-static&apos;</code>; every other HTTP
        method is never cached, even if placed in the same file as a cached <code>GET</code>.
      </p>
      <p>
        The Running Example now has a real one: <code>app/api/todos/route.ts</code> returns the
        todo list as JSON, independent of the <code>/todos</code> UI route:
      </p>
      <CodeBlock
        filename="app/api/todos/route.ts"
        code={`
import { initialTodos } from '@/lib/todo-app/types'

export async function GET() {
  return Response.json(initialTodos)
}
`}
      />
      <p>Click the button below to hit that real endpoint from the browser:</p>
      <Demo title="fetching the real /api/todos Route Handler">
        <RouteHandlerDemo />
      </Demo>
      <VueComparison>
        This maps directly onto Nuxt&apos;s <code>server/api/*.ts</code> files (Nitro server
        routes) — both are file-based, both let a file name itself after the HTTP verb it handles
        (Nitro: <code>todos.get.ts</code>; Next: an exported <code>GET</code> function in{" "}
        <code>todos/route.ts</code>), and both are a separate concern from your page/component
        tree. The main difference is granularity: Nitro typically keys one file per verb via the
        filename suffix, while a single Next <code>route.ts</code> can export several verb
        handlers together in one file.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            You want to add a <code>POST /api/todos</code> endpoint that creates a new todo from a
            JSON request body, returning the created todo. Sketch the exported function signature
            and how you&apos;d read the body.
          </p>
        }
        solution={
          <CodeBlock
            filename="app/api/todos/route.ts (sketch)"
            code={`
export async function POST(request: Request) {
  const body = await request.json() as { text: string }
  const todo = { id: crypto.randomUUID(), text: body.text, done: false }
  // ...persist todo...
  return Response.json(todo, { status: 201 })
}
`}
          />
        }
      />
    </Lesson>
  );
}
