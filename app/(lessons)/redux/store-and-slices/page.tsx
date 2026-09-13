import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { CounterDemo } from "./CounterDemo";

export default function Page() {
  return (
    <Lesson track="redux" slug="store-and-slices" title="Store & Slices">
      <p>
        Redux Toolkit — the modern, official way to write Redux — has two core building blocks:{" "}
        <code>configureStore</code> creates a single store holding your entire app&apos;s client
        state, and <code>createSlice</code> defines one self-contained corner of that state: an{" "}
        <code>initialState</code> value plus the <strong>reducers</strong> that can change it. A
        slice bundles what a bare Redux reducer function and its action creators used to be three
        separate hand-written pieces into one call:
      </p>
      <CodeBlock
        filename="a standalone counter slice"
        code={`
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    incremented(state, action: PayloadAction<number>) {
      state.value += action.payload // looks like a mutation...
    },
    reset(state) {
      state.value = 0
    },
  },
})

export const { incremented, reset } = counterSlice.actions
export const counterReducer = counterSlice.reducer
`}
      />
      <p>
        That <code>state.value += action.payload</code> line looks exactly like the kind of direct
        mutation the React Track warned you off of with <code>useState</code> — and yet it&apos;s
        completely safe here. Every reducer inside <code>createSlice</code> is wrapped in{" "}
        <a
          href="https://immerjs.github.io/immer/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Immer
        </a>
        , which lets you write reducers as if you were mutating a plain draft object, then
        produces a brand-new immutable state object behind the scenes by diffing that draft
        against the original. The ergonomics are mutation; the actual state transition is still
        pure and immutable — Redux&apos;s core rule (never mutate state directly) hasn&apos;t
        changed, Immer just hides the <code>{"{ ...state, value: state.value + n }"}</code>{" "}
        boilerplate that rule usually requires.
      </p>
      <p>
        <code>configureStore</code> then wires one or more slice reducers together into a single
        store, keyed by slice name:
      </p>
      <CodeBlock
        filename="wiring the slice into a store"
        code={`
import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
  reducer: { counter: counterReducer },
})
// store.getState() === { counter: { value: 0 } }
`}
      />
      <Demo title="a real Redux store behind two buttons">
        <CounterDemo />
      </Demo>
      <p>
        This Demo creates its own store (via a <code>Provider</code> from{" "}
        <code>react-redux</code>) scoped to just this page, the same one-store-per-mount pattern
        the Running Example&apos;s <code>TodoStoreProvider</code> uses starting in the next
        lessons — a real app typically has exactly one store for its whole lifetime, wrapped
        around the root once.
      </p>
      <VueComparison>
        Pinia&apos;s <code>defineStore</code> plays the same role as <code>createSlice</code>: a{" "}
        <code>state</code> function plus <code>actions</code> that update it. The difference is
        mechanism, not appearance — Pinia&apos;s <code>state.count++</code> is a{" "}
        <em>real</em> direct mutation that Vue&apos;s reactivity system tracks automatically,
        while Redux Toolkit&apos;s near-identical-looking <code>state.value += 1</code> is Immer
        producing an immutable copy behind an ergonomic illusion of mutation. Both feel the same
        to write; only one of them is actually mutating anything.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A colleague argues: &quot;Redux Toolkit reducers mutate state directly now, just like
            Pinia — the old &apos;never mutate state&apos; rule from the React Track doesn&apos;t
            apply anymore.&quot; What&apos;s wrong with that claim?
          </p>
        }
        solution={
          <p>
            The rule still applies — it&apos;s just enforced by Immer instead of by hand. Code
            inside a <code>createSlice</code> reducer only <em>looks</em> like mutation; Immer
            intercepts those writes against a draft and produces a new, structurally-shared
            immutable state object, which is what Redux actually stores and diffs against. Pinia,
            by contrast, really does mutate reactive state in place — there&apos;s no draft, no
            copy, just Vue&apos;s proxy-based reactivity noticing the write.
          </p>
        }
      />
    </Lesson>
  );
}
