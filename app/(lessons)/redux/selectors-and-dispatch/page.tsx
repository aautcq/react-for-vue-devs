import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { SelectorDispatchDemo } from "./SelectorDispatchDemo";

export default function Page() {
  return (
    <Lesson track="redux" slug="selectors-and-dispatch" title="Selectors & Dispatch">
      <p>
        A slice and a store are useless to a component until something reads from the store and
        something sends actions to it. <code>react-redux</code> exposes exactly two hooks for
        that: <code>useSelector</code> reads a piece of state (and re-renders the component
        whenever that piece changes), and <code>useDispatch</code> returns the store&apos;s{" "}
        <code>dispatch</code> function so you can send an action created by one of your slice&apos;s
        action creators.
      </p>
      <CodeBlock
        filename="the raw hooks"
        code={`
import { useSelector, useDispatch } from "react-redux"

function Counter() {
  const value = useSelector((state) => state.counter.value) // state: any
  const dispatch = useDispatch()

  return <button onClick={() => dispatch(incremented(1))}>{value}</button>
}
`}
      />
      <p>
        Used raw like this, <code>state</code> inside the selector has no type — TypeScript
        can&apos;t know your store&apos;s shape from a generic <code>useSelector</code> import, so
        every call site either falls back to <code>any</code> or needs its own hand-written
        annotation. Redux Toolkit&apos;s recommended fix is to wrap both hooks{" "}
        <strong>once</strong>, pre-bound to your specific store&apos;s types, and import those
        wrapped versions everywhere instead of the raw ones:
      </p>
      <CodeBlock
        filename="lib/redux/hooks.ts (already in this repo)"
        code={`
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import type { AppDispatch, RootState } from "./store"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
`}
      />
      <p>
        With <code>useAppSelector</code>, the <code>state</code> parameter is inferred as your
        real <code>RootState</code> — autocomplete and type errors work at every call site, and if
        a slice is renamed or removed, every selector referencing it fails to compile instead of
        silently returning <code>undefined</code> at runtime. <code>useAppDispatch</code> similarly
        types <code>dispatch</code> so it only accepts actions your store actually knows about
        (including thunks, if you use them). This repo&apos;s <code>lib/redux/hooks.ts</code>{" "}
        defines exactly this pair once; every Redux Demo from here on imports{" "}
        <code>useAppSelector</code>/<code>useAppDispatch</code> from there instead of{" "}
        <code>react-redux</code> directly.
      </p>
      <Demo title="the same counter, now via typed hooks">
        <SelectorDispatchDemo />
      </Demo>
      <p>
        Functionally this Demo behaves identically to the previous lesson&apos;s — the difference
        is invisible at runtime and only shows up in the editor: hover <code>state</code> inside
        the selector and TypeScript already knows it&apos;s <code>{"{ counter: { value: number } }"}</code>
        , no annotation required.
      </p>
      <VueComparison>
        Pinia doesn&apos;t need a separate &quot;selector&quot; concept at all: a component calls{" "}
        <code>useCounterStore()</code> and reads <code>store.value</code> directly — the store{" "}
        <em>is</em> already reactive state, fully typed from wherever <code>defineStore</code> was
        declared, no wrapping hook required. Redux&apos;s split into a plain, serializable store
        plus hooks that subscribe components to slices of it is more ceremony up front, but it
        buys the ability to select and memoize very specific derived slivers of state (see later
        lessons on selector performance) independently of any single component.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Why does this repo define <code>useAppSelector</code>/<code>useAppDispatch</code> once
            in <code>lib/redux/hooks.ts</code> rather than having every component import{" "}
            <code>useSelector</code>/<code>useDispatch</code> straight from{" "}
            <code>react-redux</code> and annotate the state type inline each time?
          </p>
        }
        solution={
          <p>
            One shared pair of typed hooks is the single place the store&apos;s{" "}
            <code>RootState</code>/<code>AppDispatch</code> types are wired in — every component
            gets full inference for free, and if the store&apos;s shape changes, TypeScript flags
            every affected call site automatically. Importing the raw hooks everywhere and
            annotating <code>state</code> by hand at each call site duplicates that type
            information across the codebase and risks it drifting out of sync with the real store.
          </p>
        }
      />
    </Lesson>
  );
}
