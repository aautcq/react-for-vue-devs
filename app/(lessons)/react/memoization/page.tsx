import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoDemo } from "./TodoDemo";

export default function Page() {
  return (
    <Lesson track="react" slug="memoization" title="memo, useMemo & useCallback">
      <p>
        Recall from the JSX lesson: React has no build-time dependency tracking. When a
        component&apos;s state changes, React re-renders <em>that component and every descendant
        in its subtree</em> by default — not just the DOM nodes that actually depend on the
        changed value. Usually that&apos;s fine, because re-rendering is &quot;just&quot; calling
        functions and diffing, which is cheap. But for expensive computations or large subtrees,
        it can genuinely cost you, and React gives you three manual tools to opt out.
      </p>
      <CodeBlock
        filename="the three tools"
        code={`
// 1. Skip re-rendering a component if its props haven't changed
const TodoItem = memo(function TodoItem({ todo, onToggle }: Props) { ... })

// 2. Skip recomputing an expensive derived value unless its inputs changed
const completedCount = useMemo(() => todos.filter(t => t.done).length, [todos])

// 3. Keep a function's identity stable across renders, so #1 actually works
const handleToggle = useCallback((id: string) => { ... }, [])
`}
      />
      <p>
        These three exist together for a reason: <code>memo</code> compares a component&apos;s new
        props to its old ones by reference (<code>Object.is</code>), not deep equality. An inline
        arrow function passed as a prop (<code>{"onToggle={id => ...}"}</code>) is a{" "}
        <em>new</em> function on every render, so <code>memo</code> would see &quot;different
        props&quot; every time and re-render anyway — <code>useCallback</code> is what makes the
        callback&apos;s identity stable so <code>memo</code> can actually skip work.
      </p>
      <p>
        <strong>Be honest with yourself about this being friction.</strong> This is a real,
        recurring cost of React&apos;s model that Vue&apos;s compiler-tracked fine-grained
        reactivity mostly sidesteps — a Vue template only re-evaluates the specific bindings whose
        dependencies changed, with no equivalent manual opt-in required. Don&apos;t reach for{" "}
        <code>memo</code>/<code>useMemo</code>/<code>useCallback</code> preemptively: they add
        indirection and their own dependency-array bugs, and premature memoization is a common
        source of subtle staleness. Profile first, then memoize the specific bottleneck.
      </p>
      <p>
        The Running Example below wraps <code>TodoItem</code> in <code>memo</code>, derives a
        &quot;completed count&quot; with <code>useMemo</code>, and passes a stable{" "}
        <code>onToggle</code> via <code>useCallback</code> — so clicking an unrelated
        &quot;re-render the parent&quot; button doesn&apos;t re-render every <code>TodoItem</code>.
      </p>
      <Demo title="memo + useCallback preventing unnecessary TodoItem re-renders">
        <TodoDemo />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/react/memoization/TodoDemo.tsx (abridged)"
        code={`
const TodoItem = memo(function TodoItem({ todo, onToggle }: Props) {
  return <li>...</li>
})

const handleToggle = useCallback((id: string) => {
  setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
}, []) // stable identity: TodoItem's "onToggle" prop never changes

const completedCount = useMemo(
  () => todos.filter(t => t.done).length,
  [todos]
)
`}
      />
      <VueComparison>
        Vue&apos;s reactivity system tracks exactly which reactive values a computed property or
        template binding read, and only re-evaluates when those specific dependencies change —{" "}
        <code>computed(() =&gt; todos.value.filter(t =&gt; t.done).length)</code> is the direct
        equivalent of <code>useMemo</code> above, but it&apos;s automatic and fine-grained rather
        than an opt-in with a manual dependency array. Vue components also don&apos;t need a{" "}
        <code>memo</code>-equivalent nearly as often, because a parent re-rendering doesn&apos;t
        force its children to re-evaluate unless the specific props/data they read changed. This
        is the single biggest structural difference between the two frameworks&apos; performance
        models.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A component wraps <code>ExpensiveChart</code> in <code>memo</code>, but passes it{" "}
            <code>{"data={rawData.map(d => d.value)}"}</code> inline as a prop. It still
            re-renders on every parent render. Why, and how would you fix it?
          </p>
        }
        solution={
          <p>
            <code>.map()</code> creates a brand-new array every render, so even though its{" "}
            <em>contents</em> are equal, its reference isn&apos;t — <code>memo</code>&apos;s
            shallow comparison sees a &quot;new&quot; <code>data</code> prop every time and
            re-renders regardless. Wrap the derived array in{" "}
            <code>{"useMemo(() => rawData.map(d => d.value), [rawData])"}</code> so it keeps the
            same reference across renders where <code>rawData</code> hasn&apos;t changed, which is
            what lets <code>memo</code> on <code>ExpensiveChart</code> actually skip work.
          </p>
        }
      />
    </Lesson>
  );
}
