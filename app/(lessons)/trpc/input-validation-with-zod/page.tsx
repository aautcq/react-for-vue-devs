import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { ValidatedAddFormDemo } from "./ValidatedAddFormDemo";

export default function Page() {
  return (
    <Lesson track="trpc" slug="input-validation-with-zod" title="Input Validation with Zod">
      <p>
        <code>.input()</code> has appeared on every mutation in <code>todoRouter</code> since the
        first lesson, but it&apos;s worth stopping on what it actually does: it takes a{" "}
        <strong>schema</strong> — here, a <code>zod</code> object schema — and wires it into the
        procedure two ways at once. At compile time, tRPC infers the procedure&apos;s input type
        from the schema, so <code>trpc.add.mutationOptions()</code> only accepts a{" "}
        <code>&#123; text: string &#125;</code> argument. At <em>runtime</em>, before the
        procedure&apos;s handler ever runs, tRPC parses the incoming request body through that same
        schema and rejects anything that doesn&apos;t match:
      </p>
      <CodeBlock
        filename="lib/trpc/router.ts (excerpt)"
        code={`
add: publicProcedure
  .input(z.object({ text: z.string().min(1, "Todo text can't be empty.") }))
  .mutation(({ input }) => addTodo(input.text)),
`}
      />
      <p>
        <code>z.string()</code> alone would satisfy the TypeScript type — an empty string is still
        a <code>string</code> — but <code>.min(1)</code> is a runtime refinement TypeScript
        can&apos;t express in the type system at all. That&apos;s the crucial detail: a client that
        skips its own <code>if (!text.trim()) return</code> guard (or is compromised, or is a
        totally different client hitting <code>/api/trpc</code> directly with curl) can still send{" "}
        <code>&#123; text: &quot;&quot; &#125;</code> — the type alone doesn&apos;t stop it. What
        stops it is the schema running again on the server, independent of whatever the browser
        did or didn&apos;t check.
      </p>
      <p>
        The Demo below intentionally omits the usual empty-string guard on submit, so you can watch
        that rejection happen live. Type nothing (or only spaces) and click Add — the request still
        goes to <code>/api/trpc/add</code>, still gets parsed by <code>z.string().min(1)</code>, and
        still comes back as an error the mutation surfaces in the UI:
      </p>
      <Demo title="submitting empty text — rejected by the server's zod schema, not the client">
        <ValidatedAddFormDemo />
      </Demo>
      <p>
        Two failure modes are worth distinguishing here. If you tried to call{" "}
        <code>addMutation.mutate(&#123; text: 42 &#125;)</code> — the wrong <em>type</em> entirely
        — TypeScript would refuse to compile it; you&apos;d never see a network request at all.
        Submitting an empty <em>string</em>, though, compiles fine (it&apos;s the right type, just
        an invalid value), so it does reach the server — and that request comes back as a{" "}
        <code>TRPCError</code> whose message is exactly the one passed to{" "}
        <code>.min(1, &quot;...&quot;)</code>, which <code>addMutation.error.message</code> exposes
        directly in the Demo above.
      </p>
      <VueComparison>
        A Nuxt/Vue form typically validates with something like VeeValidate or a Zod schema running{" "}
        <em>only</em> in the browser, before the request is sent — which is exactly the gap this
        lesson closes. Nothing stops a request from reaching a Nitro <code>server/api/*.ts</code>{" "}
        route without going through that client-side validation first, unless the handler itself
        re-parses the body with the same (or an equivalent) schema. tRPC doesn&apos;t make this
        optional: the <code>.input()</code> schema on a procedure runs on every call, so
        there&apos;s no way to define a procedure that skips server-side validation by accident —
        client-side checks become purely a UX nicety for immediate feedback, never the only line of
        defense.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Suppose <code>toggle</code>&apos;s input schema were changed from{" "}
            <code>z.object(&#123; id: z.string() &#125;)</code> to{" "}
            <code>z.object(&#123; id: z.string().uuid() &#125;)</code>, and a client called{" "}
            <code>trpc.toggle.mutate(&#123; id: &quot;1&quot; &#125;)</code> (a real id from{" "}
            <code>initialTodos</code>, but not a UUID). Would this fail at compile time, at
            runtime, both, or neither?
          </p>
        }
        solution={
          <p>
            Runtime only. <code>z.string().uuid()</code> still infers to the TypeScript type{" "}
            <code>string</code> — <code>.uuid()</code> is a runtime-only refinement, just like{" "}
            <code>.min(1)</code> on the <code>add</code> procedure. So{" "}
            <code>&#123; id: &quot;1&quot; &#125;</code> type-checks fine and compiles without
            complaint. At runtime, though, the schema parses the input before{" "}
            <code>toggle</code>&apos;s handler runs, <code>&quot;1&quot;</code> fails the{" "}
            <code>.uuid()</code> check, and the call comes back as a <code>TRPCError</code> with a
            Zod-generated validation message — the same category of failure demonstrated in this
            lesson&apos;s Demo, just triggered by a different schema.
          </p>
        }
      />
    </Lesson>
  );
}
