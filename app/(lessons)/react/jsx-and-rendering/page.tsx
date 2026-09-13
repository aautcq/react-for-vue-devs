import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

function Greeting({ name }: { name: string }) {
  const excited = name.length > 0;
  return (
    <p className="text-lg">
      Hello, <strong>{name || "stranger"}</strong>
      {excited ? "!" : "."}
    </p>
  );
}

export default function Page() {
  return (
    <Lesson track="react" slug="jsx-and-rendering" title="JSX & the Rendering Model">
      <p>
        JSX is not a template language bolted onto JavaScript — it&apos;s syntax sugar that compiles
        directly to <code>React.createElement</code> calls (or, with the modern JSX transform,
        calls into <code>react/jsx-runtime</code>). Every <code>{"<Tag prop={value} />"}</code> you
        write becomes a plain JavaScript function call that returns a plain JavaScript object
        describing what to render.
      </p>
      <CodeBlock
        filename="conceptually equivalent"
        code={`
// What you write:
const el = <Greeting name="Ada" />

// What it compiles to:
const el = jsx(Greeting, { name: "Ada" })
`}
      />
      <p>
        Because JSX is just function calls, any valid JavaScript expression can appear inside{" "}
        <code>{"{ }"}</code> — string concatenation, ternaries, function calls, array{" "}
        <code>.map()</code>. There is no separate template DSL to learn, and no special directives
        like <code>v-if</code> or <code>v-for</code>: it&apos;s all just JavaScript.
      </p>
      <Demo title="a component using a plain JS expression inline">
        <Greeting name="Ada" />
        <Greeting name="" />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/react/jsx-and-rendering/page.tsx"
        code={`
function Greeting({ name }: { name: string }) {
  const excited = name.length > 0
  return (
    <p>
      Hello, <strong>{name || "stranger"}</strong>
      {excited ? "!" : "."}
    </p>
  )
}
`}
      />
      <p>
        <strong>Rendering model:</strong> calling a component function doesn&apos;t touch the DOM.
        It returns a tree of these lightweight objects (the &quot;virtual DOM&quot;). React then
        diffs the new tree against the previous one and applies the minimal set of real DOM
        mutations. Re-rendering a component means calling its function again — cheap, since it only
        produces a description, not DOM writes.
      </p>
      <VueComparison>
        Vue&apos;s Single-File Components compile <code>{"<template>"}</code> into a render
        function too — so structurally it&apos;s similar. The big difference is Vue&apos;s compiler
        does dependency-tracking analysis on the template at build time (fine-grained reactivity:
        it knows exactly which DOM node depends on which ref). React has no such compiler step by
        default: every re-render re-executes the whole component function, and diffing is what
        keeps that cheap. This is why later lessons on <code>memo</code>/<code>useMemo</code> matter
        more in React than the equivalent rarely does in Vue.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Without running it, what does <code>{'<Greeting name={"Grace" + " " + "Hopper"} />'}</code>{" "}
            render? Then check: is that expression something <code>v-for</code>/<code>v-if</code>{" "}
            directive syntax could even express directly, or does Vue also fall back to plain JS
            here?
          </p>
        }
        solution={
          <p>
            It renders <code>Hello, Grace Hopper!</code> — string concatenation is plain JS, so it
            works inside <code>{"{ }"}</code> with no special syntax. Vue&apos;s templates allow
            plain JS expressions inside interpolations too (<code>{"{{ }}"}</code>), so this
            particular case looks identical in both — the difference only shows up with
            control-flow (loops/conditionals), which Vue models as directives and React models as
            plain JS.
          </p>
        }
      />
    </Lesson>
  );
}
