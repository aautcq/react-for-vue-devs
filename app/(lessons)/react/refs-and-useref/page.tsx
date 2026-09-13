import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoDemo } from "./TodoDemo";

export default function Page() {
  return (
    <Lesson track="react" slug="refs-and-useref" title="Refs & useRef">
      <p>
        <code>useRef</code> creates a mutable box — <code>{"{ current: value }"}</code> — that
        persists across re-renders but, critically, <strong>does not cause a re-render</strong>{" "}
        when you write to it. That makes it useful for two unrelated things that both need
        &quot;value survives across renders&quot;: getting a handle on a real DOM node, and
        stashing a mutable value (a timer ID, a previous prop, a counter) that the component reads
        imperatively but never needs to display.
      </p>
      <CodeBlock
        filename="two uses of useRef"
        code={`
// 1. A DOM ref: React attaches the real <input> element to .current
const inputRef = useRef<HTMLInputElement>(null)
<input ref={inputRef} />
inputRef.current?.focus()

// 2. A mutable value that isn't part of the rendered output
const renderCount = useRef(0)
renderCount.current += 1 // no re-render triggered, unlike setState
`}
      />
      <p>
        Contrast that with <code>useState</code>: calling its setter always schedules a re-render,
        because state is meant to be reflected in what the component renders. A ref is for values
        the component <em>needs</em> but doesn&apos;t <em>render</em> — mutating{" "}
        <code>ref.current</code> is a deliberate opt-out of React&apos;s re-render-on-change
        contract, so reach for state first and only drop to a ref when you&apos;re sure the value
        shouldn&apos;t affect the UI.
      </p>
      <p>
        The Running Example uses a ref to refocus the &quot;new todo&quot; input immediately after
        adding one, so you can keep typing without reaching for the mouse — a small UX touch that&apos;s
        pure DOM manipulation, not something expressible as a prop or piece of state.
      </p>
      <Demo title="auto-focus after adding a todo, via a ref">
        <TodoDemo />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/react/refs-and-useref/TodoDemo.tsx (abridged)"
        code={`
const inputRef = useRef<HTMLInputElement>(null)

function addTodo() {
  setTodos(prev => [...prev, { id: crypto.randomUUID(), text, done: false }])
  setText("")
  inputRef.current?.focus() // imperative escape hatch
}

<input ref={inputRef} value={text} onChange={e => setText(e.target.value)} />
`}
      />
      <VueComparison>
        A DOM <code>useRef</code> is the same idea as Vue&apos;s template refs (
        <code>{'const inputRef = ref<HTMLInputElement | null>(null)'}</code> paired with{" "}
        <code>{"<input ref=\"inputRef\">"}</code>) — both give you the raw element outside the
        reactive/declarative system. The mutable-value use case has no direct Vue equivalent
        though: in Vue, a plain (non-<code>ref</code>) local variable captured in a closure already
        behaves like this, since Vue&apos;s reactivity is opt-in via <code>ref</code>/
        <code>reactive</code>, whereas in React every <code>useState</code> variable is
        already &quot;reactive&quot; by default, so <code>useRef</code> exists specifically as the
        opt-<em>out</em>.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Why won&apos;t this work as intended: a component reads{" "}
            <code>const clickCountRef = useRef(0)</code>, increments{" "}
            <code>clickCountRef.current</code> in an <code>onClick</code> handler, and renders{" "}
            <code>{"<p>Clicked {clickCountRef.current} times</p>"}</code> in its JSX?
          </p>
        }
        solution={
          <p>
            Mutating a ref never schedules a re-render, so the displayed text won&apos;t update
            after the first click even though <code>clickCountRef.current</code> really is
            changing — you&apos;d only see the new value if something else caused this component to
            re-render for an unrelated reason. Since this value needs to appear in the UI, it
            should be <code>useState</code> instead: <code>const [clickCount, setClickCount] =
            useState(0)</code>, incrementing with <code>setClickCount(c =&gt; c + 1)</code>.
          </p>
        }
      />
    </Lesson>
  );
}
