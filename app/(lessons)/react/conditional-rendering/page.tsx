import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoSummary } from "./TodoSummary";

export default function Page() {
  return (
    <Lesson track="react" slug="conditional-rendering" title="Conditional Rendering">
      <p>
        React has no <code>v-if</code>/<code>v-show</code> directives — conditional rendering is
        just JavaScript, expressed one of three ways depending on the shape of the condition.
      </p>
      <CodeBlock
        filename="the three shapes"
        code={`
// 1. && — render something, or nothing
{doneCount === todos.length && <p>All done! 🎉</p>}

// 2. ternary — render one of two things
{todos.length === 0 ? <EmptyState /> : <TodoList todos={todos} />}

// 3. early return — bail out of the whole component before the main JSX
function TodoSummary({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return <EmptyState />
  }
  return <TodoList todos={todos} />
}
`}
      />
      <p>
        <code>&&</code> is the most common, but it has a sharp edge: <code>&&</code> renders its
        left-hand value whenever that value is falsy. <code>false</code>, <code>null</code>,{" "}
        <code>undefined</code>, and <code>&quot;&quot;</code> all render as nothing — but{" "}
        <code>0</code> renders as the literal text &quot;0&quot;, because <code>0</code> is falsy
        yet still a value React will render. <code>{"{todos.length && <List />}"}</code> will
        print a stray <code>0</code> on an empty list, for exactly this reason.
      </p>
      <CodeBlock
        filename="the 0/&& pitfall"
        code={`
// ❌ renders the literal "0" when todos.length is 0
{todos.length && <TodoList todos={todos} />}

// ✅ coerce to a real boolean first
{todos.length > 0 && <TodoList todos={todos} />}
`}
      />
      <p>
        The demo below uses an early return for the empty state (no todos at all: a friendly
        message instead of an empty list), and <code>&&</code> for the &quot;all done&quot; banner
        that should only appear once every remaining todo is checked off.
      </p>
      <Demo title="empty state (early return) + a completion summary (&&)">
        <TodoSummary />
      </Demo>
      <VueComparison>
        <code>v-if</code>/<code>v-else</code>/<code>v-show</code> are template directives Vue&apos;s
        compiler understands specially. React folds the same three needs into plain JS: a ternary
        covers <code>v-if</code>/<code>v-else</code>, <code>&&</code> covers a bare{" "}
        <code>v-if</code> with no else branch, and an early <code>return</code> covers cases where
        an entire component should render something completely different (which Vue would usually
        also handle with <code>v-if</code> at the root of the template). There&apos;s no React
        equivalent of <code>v-show</code>&apos;s &quot;keep it mounted, just toggle CSS
        display&quot; — you&apos;d reach for conditional <code>className</code>/inline styles
        instead if you want that specific behavior.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A teammate writes <code>{"{todos.filter((t) => t.done).length && <p>All caught up</p>}"}</code>{" "}
            to show a message only when at least one todo is done. What renders when zero todos
            are done, and how would you fix it?
          </p>
        }
        solution={
          <p>
            When zero todos are done, <code>todos.filter(...).length</code> is <code>0</code> — a
            falsy number, but still a renderable value — so React renders the text{" "}
            <code>0</code> instead of nothing. The fix is to force a real boolean before the{" "}
            <code>&&</code>, e.g. <code>{"todos.some((t) => t.done) && <p>...</p>"}</code>, or{" "}
            <code>{"todos.filter((t) => t.done).length > 0 && <p>...</p>"}</code>.
          </p>
        }
      />
    </Lesson>
  );
}
