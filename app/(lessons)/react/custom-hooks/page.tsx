import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoDemo } from "./TodoDemo";

export default function Page() {
  return (
    <Lesson track="react" slug="custom-hooks" title="Custom Hooks">
      <p>
        A custom hook is nothing magical — it&apos;s a plain JavaScript function that happens to
        call other hooks (<code>useState</code>, <code>useEffect</code>, <code>useReducer</code>,
        even other custom hooks) internally, and by convention its name starts with{" "}
        <code>use</code>. That prefix isn&apos;t just style: it&apos;s how React&apos;s linter
        rules and React itself know a function is allowed to call hooks and needs the{" "}
        <em>Rules of Hooks</em> (only call at the top level, only from components or other hooks)
        enforced on it.
      </p>
      <CodeBlock
        filename="the minimal shape of a custom hook"
        code={`
function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = () => setValue(v => !v)
  return [value, toggle] as const
}

// used exactly like a built-in hook, in any component
function Panel() {
  const [open, toggleOpen] = useToggle()
  return <button onClick={toggleOpen}>{open ? "Close" : "Open"}</button>
}
`}
      />
      <p>
        The value of extracting a custom hook is the same as extracting any well-named function:
        reusable stateful logic, tested and reasoned about in one place, with an interface that
        hides its internals. A component using <code>useTodos()</code> doesn&apos;t need to know
        whether it&apos;s backed by <code>useState</code> or <code>useReducer</code>, or that it
        persists to <code>localStorage</code> — it just gets back data and functions to call.
      </p>
      <p>
        The Running Example pulls together everything from the last few lessons — the reducer from{" "}
        <code>useReducer</code>, the <code>localStorage</code> persistence from{" "}
        <code>useEffect</code> — behind one <code>useTodos()</code> hook returning{" "}
        <code>{"{ todos, addTodo, toggleTodo, removeTodo }"}</code>. The demo component itself no
        longer contains any todo-list logic at all, just the UI.
      </p>
      <Demo title="a component consuming useTodos(), with no todo logic of its own">
        <TodoDemo />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/react/custom-hooks/TodoDemo.tsx (abridged)"
        code={`
function useTodos() {
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadInitialTodos)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  return {
    todos,
    addTodo: (text: string) => dispatch({ type: "add", text }),
    toggleTodo: (id: string) => dispatch({ type: "toggle", id }),
    removeTodo: (id: string) => dispatch({ type: "remove", id }),
  }
}

// the component itself:
function TodoDemo() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos()
  // ...render using those four things, no reducer/effect visible here
}
`}
      />
      <VueComparison>
        Custom hooks are React&apos;s direct answer to Vue&apos;s <strong>composables</strong> —{" "}
        <code>useTodos()</code> here is the same idea as a <code>useTodos()</code>/
        <code>useTodoList()</code> composable built on <code>ref</code>/<code>reactive</code> and{" "}
        <code>watchEffect</code>. The mechanics differ (a custom hook re-runs its whole function
        body on every render, relying on the Rules of Hooks to keep hook call order stable; a
        composable&apos;s <code>setup()</code> code runs once and its reactivity is tracked
        automatically), but the motivation — package up stateful logic behind a function you can
        call from multiple components — is identical.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Why must a function calling <code>useState</code> internally be named starting with{" "}
            <code>use</code> (e.g. <code>useToggle</code>), rather than something like{" "}
            <code>createToggle</code> or <code>toggleHelper</code>?
          </p>
        }
        solution={
          <p>
            It&apos;s a convention, but an enforced one: the <code>use</code> prefix is what the{" "}
            <code>react-hooks/rules-of-hooks</code> ESLint rule (and, in spirit, React itself)
            uses to recognize that a function calls hooks and must therefore itself follow the
            Rules of Hooks — called unconditionally at the top level of a component or another
            hook, never inside a loop, condition, or nested regular function. Naming it{" "}
            <code>createToggle</code> would hide that from the linter, so a conditional call to it
            wouldn&apos;t be flagged even though it would break React&apos;s hook-order guarantees.
          </p>
        }
      />
    </Lesson>
  );
}
