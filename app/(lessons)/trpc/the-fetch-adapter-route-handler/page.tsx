import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { FetchAdapterRouteHandlerDemo } from "./FetchAdapterRouteHandlerDemo";

export default function Page() {
  return (
    <Lesson
      track="trpc"
      slug="the-fetch-adapter-route-handler"
      title="The Fetch Adapter Route Handler"
    >
      <p>
        A router full of typed procedures is only useful once something serves it over HTTP.
        tRPC ships several &quot;adapters&quot; for this — one per server runtime — and the one
        that matters here is the <strong>fetch adapter</strong>, <code>fetchRequestHandler</code>{" "}
        from <code>@trpc/server/adapters/fetch</code>. It speaks the Web <code>Request</code>/
        <code>Response</code> contract directly, which is exactly what a Next.js{" "}
        <code>route.ts</code> file already expects — no translation layer, no legacy{" "}
        <code>req</code>/<code>res</code> objects like tRPC&apos;s older Pages-Router-era adapters
        needed. That makes wiring a router into this app a one-file job:
      </p>
      <CodeBlock
        filename="app/api/trpc/[trpc]/route.ts"
        code={`
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { todoRouter } from '@/lib/trpc/router'

function handler(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: todoRouter,
  })
}

export { handler as GET, handler as POST }
`}
      />
      <p>
        The <code>[trpc]</code> catch-all segment means every procedure — <code>list</code>,{" "}
        <code>add</code>, <code>toggle</code>, <code>remove</code> — is served from this single
        Route Handler, dispatched by path (<code>/api/trpc/list</code>,{" "}
        <code>/api/trpc/add</code>, and so on) instead of one file per procedure. Queries arrive as{" "}
        <code>GET</code> requests with the input serialized into the query string; mutations
        arrive as <code>POST</code> with a JSON body — which is why the handler above exports both{" "}
        <code>GET</code> and <code>POST</code>, pointing at the same function.
      </p>
      <p>
        You&apos;ll rarely call <code>fetch(&quot;/api/trpc/...&quot;)</code> by hand — that&apos;s
        what the typed client from <code>@trpc/tanstack-react-query</code> is for, and it&apos;s
        fine to see it in action now rather than wait: it&apos;s the same <code>useTRPC()</code> +{" "}
        <code>useQuery</code>/<code>useMutation</code> pattern the next lesson explores in full,
        just introduced here to prove this Route Handler is live, real, and reachable:
      </p>
      <Demo title="hitting the real /api/trpc endpoint via the fetch adapter">
        <FetchAdapterRouteHandlerDemo />
      </Demo>
      <VueComparison>
        Nitro&apos;s <code>server/api/*.ts</code> routes are also built on the standard Web{" "}
        <code>Request</code>/<code>Response</code> objects under the hood (via{" "}
        <code>h3</code>), so there&apos;s no equivalent split between a &quot;fetch adapter&quot;
        and some older, framework-specific request shape to worry about in Nuxt — every Nitro route
        has always spoken this contract. The interesting difference is on the other side: Nitro
        gives you one file per route by convention, while <code>fetchRequestHandler</code> fans a
        whole router&apos;s worth of procedures out from a single catch-all file, matched by path
        at request time instead of by the filesystem.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            The Route Handler above exports <code>handler</code> as both <code>GET</code> and{" "}
            <code>POST</code>. Given that <code>list</code> is a query and <code>add</code> is a
            mutation, which HTTP method does each one actually arrive as, and why does the same{" "}
            <code>handler</code> function work for both?
          </p>
        }
        solution={
          <p>
            <code>list</code> (a query) arrives as <code>GET</code>; <code>add</code> (a mutation)
            arrives as <code>POST</code> — that split is a convention of tRPC&apos;s client, not
            something this file decides. The same <code>handler</code> works for both because
            it doesn&apos;t branch on the procedure type at all: it just hands the incoming{" "}
            <code>Request</code> straight to <code>fetchRequestHandler</code>, which reads the URL
            path to find the matching procedure in <code>todoRouter</code>, reads the method to know
            whether to parse input from the query string or the JSON body, and calls the right
            procedure either way.
          </p>
        }
      />
    </Lesson>
  );
}
