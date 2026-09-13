import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoList } from "./TodoList";

export default function Page() {
  return (
    <Lesson track="react" slug="state-with-usestate" title="State with useState">
      <p>
        The previous lesson&apos;s <code>TodoItem</code> was purely a function of its props — call
        it again with the same <code>todo</code>, get the same output. To make the checkbox
        actually toggle, the list needs a place to keep values that can change over time and, when
        they do, tell React to re-render. That&apos;s exactly what <code>useState</code> is for.
      </p>
      <p>
        Why not just use a plain module-level variable? Because reassigning a normal variable
        doesn&apos;t schedule a re-render — React has no way of knowing it changed. <code>useState</code>{" "}
        returns a <code>[value, setValue]</code> pair; calling <code>setValue</code> is what tells
        React &quot;this component (and only this component) needs to run again.&quot; The variable
        itself is just a snapshot captured for that one render.
      </p>
      <CodeBlock
        filename="the useState contract"
        code={`
const [todos, setTodos] = useState<Todo[]>(initialTodos)

// Reading "todos" gives you this render's snapshot.
// Calling setTodos(...) schedules a re-render with a new snapshot.
`}
      />
      <p>
        State must always be updated <strong>immutably</strong>: never push into an existing array
        or mutate an object in place. React compares the old and new state by reference to decide
        whether to re-render, so mutating in place can silently fail to trigger anything. Instead,
        build a new array/object each time:
      </p>
      <CodeBlock
        filename="immutable updates"
        code={`
// ❌ mutates in place — React may not notice
todos.push(newTodo)
setTodos(todos)

// ✅ creates a new array
setTodos([...todos, newTodo])

// ✅ toggling one item: map to a new array, replacing only the matched item
setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
`}
      />
      <p>
        When a state update depends on the previous value, prefer the{" "}
        <strong>functional update</strong> form, <code>setX(prev =&gt; ...)</code>, instead of
        reading the outer <code>todos</code> variable. This avoids bugs when multiple updates
        happen before a re-render (e.g. two quick clicks), since each functional update always
        receives the latest state rather than a possibly-stale snapshot.
      </p>
      <p>
        The Todo list is now fully interactive: adding, toggling, and removing todos all go through{" "}
        <code>useState&lt;Todo[]&gt;(initialTodos)</code> with immutable, functional updates.
      </p>
      <Demo title="an interactive Todo list backed by useState">
        <TodoList />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/react/state-with-usestate/TodoList.tsx (excerpt)"
        code={`
const [todos, setTodos] = useState<Todo[]>(initialTodos)

function toggleTodo(id: string) {
  setTodos((prev) =>
    prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
  )
}

function removeTodo(id: string) {
  setTodos((prev) => prev.filter((todo) => todo.id !== id))
}
`}
      />
      <VueComparison>
        <code>useState</code> is closest to Vue&apos;s <code>ref()</code>: both give you a
        container that triggers reactivity on write. The mental model differs though — Vue&apos;s{" "}
        <code>ref</code>/<code>reactive</code> track mutations through a Proxy, so{" "}
        <code>todos.value.push(x)</code> is perfectly fine and reactive. In React, mutating state
        directly is a bug waiting to happen, because React relies on a changed <em>reference</em>{" "}
        (not deep tracking) to know a re-render is needed — hence always copying arrays/objects
        instead of mutating them.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Suppose two clicks on &quot;Add&quot; happen in quick succession, each calling{" "}
            <code>setTodos([...todos, newTodo])</code> (reading the outer <code>todos</code>{" "}
            variable, not a functional update). What could go wrong, and how does{" "}
            <code>setTodos((prev) =&gt; [...prev, newTodo])</code> fix it?
          </p>
        }
        solution={
          <p>
            If both handlers were scheduled before either re-render committed, both reads of{" "}
            <code>todos</code> could see the same stale array, so the second call&apos;s spread
            would be based on the array <em>without</em> the first new todo — one todo could be
            lost. The functional form sidesteps this: React guarantees each queued updater function
            receives the state as of the previous updater in the queue, not a snapshot captured
            before any of them ran.
          </p>
        }
      />
    </Lesson>
  );
}
