import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="deploying" title="Deploying">
      <p>
        Everything in this course so far has run under <code>next dev</code>, which prioritizes
        fast iteration (unoptimized builds, on-demand compilation, verbose error overlays) over
        performance. Shipping to real users means building a production output and running that
        instead — the deploy target changes <em>how</em> that output is served, but not the code
        you&apos;ve written.
      </p>
      <p>Four deployment shapes are supported, with different feature support:</p>
      <CodeBlock
        filename="deployment options"
        code={`
Node.js server   -> next build && next start   -- all features supported
Docker container -> containerize the same build                -- all features supported
Static export    -> output: 'export' in next.config             -- limited (no Server Actions,
                                                                     Route Handlers that need
                                                                     request-time data, etc.)
Adapters         -> platform-specific build/deploy (e.g. Vercel, -- varies by adapter
                     Bun); the Deployment Adapter API lets a
                     platform customize how the app builds & runs
`}
      />
      <p>
        This project&apos;s <code>package.json</code> already has the two scripts a Node.js
        deployment needs:
      </p>
      <CodeBlock
        filename="package.json"
        code={`
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
`}
      />
      <p>
        <code>next build</code> compiles and optimizes the app (minified bundles, prerendered
        static pages where possible, Route Handler analysis) into <code>.next/</code>.{" "}
        <code>next start</code> then runs a production Node.js server against that output — this
        is the mode that supports every feature covered in this Track: Server Actions, Route
        Handlers, revalidation, streaming, everything.
      </p>
      <p>
        A <strong>static export</strong> (<code>output: &apos;export&apos;</code>) instead
        produces plain HTML/CSS/JS you can host anywhere that serves static files — no Node.js
        runtime required — but it drops anything that needs a server at request time: Server
        Actions, dynamic Route Handlers, and any page relying on request-time data. Given this
        course&apos;s Running Example uses Server Actions to mutate an in-memory todo store, it
        specifically could <strong>not</strong> be static-exported without first replacing those
        Server Actions with something else.
      </p>
      <p>Before shipping any Next.js app, it&apos;s worth checking:</p>
      <CodeBlock
        filename="a short pre-deploy checklist"
        code={`
- Does \`next build\` succeed locally, with no type errors?
- Which routes need a server at request time (Server Actions, dynamic Route
  Handlers, revalidation) vs which could be static? That determines whether
  static export is even an option.
- Are environment variables / secrets configured for the target platform,
  not just your local .env?
- Does the target platform's feature support match what the app needs (see
  the table above) — e.g. some platforms only offer their own partial
  Next.js integration rather than the full Adapter API?
`}
      />
      <VueComparison>
        Nuxt has the same three-way split: <code>nuxt build</code> + <code>node .output/server</code>{" "}
        for a Node server (via Nitro), <code>nuxt generate</code> for a fully static/prerendered
        site, and platform-specific presets (<code>nitro.preset</code>) for edge/serverless
        targets like Vercel or Cloudflare — conceptually the same
        dev-optimized-for-iteration-vs-build-optimized-for-production split, and the same
        static-export tradeoff (no server-only features once fully static).
      </VueComparison>
      <Exercise
        prompt={
          <p>
            The Running Example&apos;s <code>/todos</code> route uses Server Actions to mutate an
            in-memory store. If you tried deploying this course with{" "}
            <code>output: &apos;export&apos;</code>, what would break, and why?
          </p>
        }
        solution={
          <p>
            The Server Actions backing <code>/todos</code> would stop working — a static export
            has no server at request time to run them against, so anything relying on a Server
            Action (adding, toggling, or deleting a todo) needs a real Node.js/Docker/adapter
            deployment instead. The lesson pages themselves (pure prose/demo Client Components)
            would still export fine, since they don&apos;t depend on server-side mutation.
          </p>
        }
      />
    </Lesson>
  );
}
