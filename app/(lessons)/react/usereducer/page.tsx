import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoDemo } from "./TodoDemo";

export default function Page() {
  return (
    <Lesson track="react" slug="usereducer" title="useReducer">
      <p>
        <code>useState</code> works well for independent values, but once several pieces of state
        change together in response to the same events, scattering them across multiple{" "}
        <code>useState</code> calls gets error-prone — it&apos;s easy to update one and forget
        another, or to end up with combinations of state that shouldn&apos;t be possible.{" "}
        <code>useReducer</code> centralizes those related transitions into a single{" "}
        <strong>reducer function</strong>: a pure function of <code>(state, action)</code> that
        returns the next state.
      </p>
      <CodeBlock
        filename="the shape of useReducer"
        code={`
type Action = { type: "increment" } | { type: "decrement" } | { type: "reset" }

function counterReducer(state: number, action: Action): number {
  switch (action.type) {
    case "increment": return state + 1
    case "decrement": return state - 1
    case "reset": return 0
  }
}

const [count, dispatch] = useReducer(counterReducer, 0)
dispatch({ type: "increment" }) // instead of setCount(count + 1)
`}
      />
      <p>
        Instead of exposing setter functions, a reducer exposes <code>dispatch</code>, and callers
        describe <em>what happened</em> as an action object rather than computing the next state
        themselves. That keeps the state-update logic in one place, testable independently of any
        component (a reducer is just a plain function — no rendering involved), and it scales
        much better than several interdependent <code>useState</code> calls once the number of
        related transitions grows.
      </p>
      <p>
        The Running Example refactors the todo list&apos;s add/toggle/remove logic and its filter
        selection — previously separate concerns — into one <code>todosReducer</code>. Every
        interaction becomes a dispatched action instead of a direct state mutation:
      </p>
      <Demo title="add / toggle / remove / filter, all through one reducer">
        <TodoDemo />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/react/usereducer/TodoDemo.tsx (abridged)"
        code={`
type Action =
  | { type: "add"; text: string }
  | { type: "toggle"; id: string }
  | { type: "remove"; id: string }
  | { type: "set-filter"; filter: Filter }

function todosReducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": return { ...state, todos: [...state.todos, newTodo(action.text)] }
    case "toggle": return { ...state, todos: state.todos.map(t => t.id === action.id ? { ...t, done: !t.done } : t) }
    case "remove": return { ...state, todos: state.todos.filter(t => t.id !== action.id) }
    case "set-filter": return { ...state, filter: action.filter }
  }
}

const [state, dispatch] = useReducer(todosReducer, { todos: initialTodos, filter: "all" })
dispatch({ type: "toggle", id: todo.id })
`}
      />
      <VueComparison>
        There&apos;s no built-in <code>useReducer</code> equivalent in Vue, but the pattern maps to
        a reducer-style composable: a function returning reactive state plus a{" "}
        <code>dispatch</code>-like method that switches on an action, or — at larger scale — a
        Pinia store with actions that mutate state directly (Pinia leans into mutation since
        Vue&apos;s reactivity tracks it automatically, whereas a React reducer must return a new
        state object every time, never mutate <code>state</code> in place).
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A form has <code>firstName</code>, <code>lastName</code>, and <code>email</code>{" "}
            fields, each currently its own <code>useState</code>, plus a rule: submitting clears
            all three at once and increments a separate <code>submitCount</code>. Is this a good
            candidate for <code>useReducer</code>? Why?
          </p>
        }
        solution={
          <p>
            Yes — the four values change together in response to shared events (typing, submitting)
            and one of those events (&quot;submit&quot;) must update multiple fields
            atomically. A single reducer with actions like{" "}
            <code>{'{ type: "change"; field; value }'}</code> and{" "}
            <code>{'{ type: "submit" }'}</code> guarantees the clear-and-increment on submit
            happens together as one state transition, instead of relying on ordering four separate{" "}
            <code>setState</code> calls correctly.
          </p>
        }
      />
    </Lesson>
  );
}
