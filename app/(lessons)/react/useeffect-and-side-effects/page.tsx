import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoDemo } from "./TodoDemo";

export default function Page() {
  return (
    <Lesson track="react" slug="useeffect-and-side-effects" title="useEffect & Side Effects">
      <p>
        It&apos;s tempting to read <code>useEffect</code> as &quot;run this code after render&quot;
        and use it as a general-purpose escape hatch. Resist that. The React docs&apos; framing is
        more precise and more useful: <code>useEffect</code> lets you{" "}
        <strong>synchronize a component with a system outside of React</strong> — the DOM, a
        browser API like <code>localStorage</code>, a WebSocket, a subscription, a third-party
        widget. If you&apos;re not talking to something outside React, you probably don&apos;t
        need an effect at all.
      </p>
      <CodeBlock
        filename="the shape of every effect"
        code={`
useEffect(() => {
  // runs after the render commits, and re-runs whenever
  // a value in the dependency array changes
  const subscription = externalSystem.subscribe(handler)

  return () => {
    // cleanup: runs before the next effect, and on unmount
    subscription.unsubscribe()
  }
}, [dep1, dep2]) // dependency array
`}
      />
      <p>
        The <strong>dependency array</strong> tells React when the effect needs to re-synchronize.
        Omit it and the effect runs after every render. Pass <code>[]</code> and it runs once, after
        the first render (and its cleanup runs once, on unmount). Pass{" "}
        <code>{"[a, b]"}</code> and it re-runs whenever <code>a</code> or <code>b</code> changes
        between renders. The array isn&apos;t a config option you tune for performance — it&apos;s
        a correctness contract: it must list every reactive value the effect body reads. The
        exhaustive-deps ESLint rule exists to catch you lying to it.
      </p>
      <p>
        The single most common effect bug is using one to compute <strong>derived state</strong>{" "}
        — state that&apos;s just a transformation of other state or props. That needs no effect at
        all; compute it directly during render:
      </p>
      <CodeBlock
        filename="derived state: no effect needed"
        code={`
// ❌ unnecessary effect, extra render, and a bug waiting to
// happen if you forget a dependency
const [count, setCount] = useState(0)
const [doubled, setDoubled] = useState(0)
useEffect(() => {
  setDoubled(count * 2)
}, [count])

// ✅ just compute it — no state, no effect, no lag
const [count, setCount] = useState(0)
const doubled = count * 2
`}
      />
      <p>
        The Running Example below uses <code>useEffect</code> for something that genuinely is an
        external system: persisting the todo list to <code>localStorage</code> so it survives a
        page reload. Reading the initial value back out is trickier than it looks —{" "}
        <code>localStorage</code> only exists in the browser, but this component&apos;s first
        render also happens on the server. A lazy <code>useState</code> initializer function (only
        invoked once, and only for the value React actually needs) is the place to put a{" "}
        <code>typeof window === &quot;undefined&quot;</code> guard.
      </p>
      <Demo title="todos persisted to localStorage via useEffect">
        <TodoDemo />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/react/useeffect-and-side-effects/TodoDemo.tsx (abridged)"
        code={`
function loadInitialTodos(): Todo[] {
  if (typeof window === "undefined") return initialTodos // SSR guard
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : initialTodos
}

const [todos, setTodos] = useState<Todo[]>(loadInitialTodos) // lazy initializer

useEffect(() => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}, [todos]) // synchronize storage whenever todos changes
`}
      />
      <VueComparison>
        <code>useEffect</code> with a dependency array is closest to Vue&apos;s <code>watch</code>{" "}
        with an explicit source, or <code>watchEffect</code> for auto-tracked dependencies — except
        React can&apos;t auto-track anything (no compiler-tracked reactivity), so you list
        dependencies by hand. The mount-only <code>useEffect(fn, [])</code> pattern covers what{" "}
        <code>onMounted</code> does, and its cleanup function covers <code>onUnmounted</code> —
        but both are folded into one hook rather than two separate lifecycle APIs.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A teammate writes <code>useEffect(() =&gt; setFullName(first + &quot; &quot; +
            last), [first, last])</code> to keep a <code>fullName</code> state variable up to date.
            What&apos;s wrong with this, and how would you fix it?
          </p>
        }
        solution={
          <p>
            <code>fullName</code> is derived state — it can be computed directly from{" "}
            <code>first</code> and <code>last</code> during render, so it needs no{" "}
            <code>useState</code> or <code>useEffect</code> at all:{" "}
            <code>const fullName = first + &quot; &quot; + last</code>. The effect version adds an
            extra render (state update → re-render) after every change, and risks going stale if
            the dependency array is ever wrong.
          </p>
        }
      />
    </Lesson>
  );
}
