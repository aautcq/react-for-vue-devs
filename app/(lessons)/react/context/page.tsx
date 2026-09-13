import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoDemo } from "./TodoDemo";

export default function Page() {
  return (
    <Lesson track="react" slug="context" title="Context">
      <p>
        Props flow one way, down the tree. When a deeply nested component needs a value from a
        distant ancestor, the naive fix is <strong>prop drilling</strong>: threading that value
        through every intermediate component, even ones that don&apos;t use it themselves.
        Context is React&apos;s escape hatch from that — a way to make a value available to an
        entire subtree without passing it explicitly at every level.
      </p>
      <CodeBlock
        filename="the three pieces of Context"
        code={`
const ThemeContext = createContext<"light" | "dark" | null>(null)

// 1. Provide it once, near the top of the subtree
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 2. Consume it anywhere below, however deep
function DeepChild() {
  const theme = useContext(ThemeContext)
  return <div className={theme}>...</div>
}
`}
      />
      <p>
        Context is not a general-purpose global store, and it&apos;s not a replacement for props
        as your default way of passing data — reach for it only when a value is genuinely
        cross-cutting (theme, current user, locale, a filter that many unrelated components need).
        If only one or two components need a value, passing it as a prop is simpler to trace and
        type-check than adding a context. Overusing context also makes a component harder to reuse
        elsewhere, since it now silently depends on being rendered inside a specific provider.
      </p>
      <p>
        The Running Example below introduces a <code>TodoFilterContext</code> holding the current
        filter (&quot;all&quot; / &quot;active&quot; / &quot;completed&quot;) and a setter. It&apos;s
        provided once at the top of the demo, then consumed independently by the filter buttons{" "}
        <em>and</em> the list that renders filtered todos — two siblings that would otherwise need
        the filter state lifted and drilled through a shared parent.
      </p>
      <Demo title="filter state shared via context, not props">
        <TodoDemo />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/react/context/TodoDemo.tsx (abridged)"
        code={`
const TodoFilterContext = createContext<{
  filter: Filter
  setFilter: (f: Filter) => void
} | null>(null)

function FilterButtons() {
  const { filter, setFilter } = useContext(TodoFilterContext)! // consumer #1
  // ...
}

function TodoList({ todos }: { todos: Todo[] }) {
  const { filter } = useContext(TodoFilterContext)! // consumer #2, unrelated tree branch
  // ...
}

<TodoFilterContext.Provider value={{ filter, setFilter }}>
  <FilterButtons />
  <TodoList todos={todos} />
</TodoFilterContext.Provider>
`}
      />
      <VueComparison>
        Context maps closely to Vue&apos;s <code>provide</code>/<code>inject</code>: a{" "}
        <code>Provider</code> is <code>provide(key, value)</code> in an ancestor&apos;s{" "}
        <code>setup()</code>, and <code>useContext</code> is <code>inject(key)</code> in any
        descendant. One difference worth knowing: React re-renders every consumer of a context
        when its value changes (there&apos;s no fine-grained tracking of which <em>part</em> of the
        value a consumer actually reads), whereas Vue&apos;s <code>inject</code>ed refs stay
        individually reactive — another spot where Vue&apos;s compiler-tracked reactivity buys you
        something React makes you think about manually (see the upcoming memoization lesson).
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A component three levels deep needs a single <code>onDeleteAccount</code> callback
            that only it uses. A teammate suggests wrapping the app in a{" "}
            <code>DeleteAccountContext</code>. Is that a good use of Context? What would you do
            instead?
          </p>
        }
        solution={
          <p>
            No — a single value consumed by a single component is exactly what plain props are
            for, even across a few levels of intermediate components that just forward it. Context
            earns its complexity when a value is needed by many components scattered across a
            subtree; here it would just hide a simple dependency behind an extra layer of
            indirection. Passing <code>onDeleteAccount</code> down as a normal prop (or lifting the
            handler itself closer to where it&apos;s used) is simpler and easier to trace.
          </p>
        }
      />
    </Lesson>
  );
}
