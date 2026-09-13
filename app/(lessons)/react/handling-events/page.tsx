import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoList } from "./TodoList";

export default function Page() {
  return (
    <Lesson track="react" slug="handling-events" title="Handling Events">
      <p>
        Event handlers in JSX are just props: <code>onClick</code>, <code>onChange</code>,{" "}
        <code>onSubmit</code>, and dozens more, each expecting a function. React normalizes the
        browser&apos;s native events into its own <strong>SyntheticEvent</strong> wrapper, so the
        same handler shape works consistently across browsers — but for everyday use, it behaves
        just like the native event you already know (<code>e.target</code>,{" "}
        <code>e.preventDefault()</code>, etc.).
      </p>
      <CodeBlock
        filename="attaching a handler"
        code={`
<input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
<button onClick={() => onDelete(todo.id)}>Delete</button>
`}
      />
      <p>
        Handlers are commonly defined in a parent and <strong>passed down as props</strong>, so a
        presentational child (like <code>TodoRow</code>) doesn&apos;t need to know how toggling or
        deleting actually works — it just calls whatever function it was given. This keeps state
        changes centralized in the component that owns the state, which is exactly where{" "}
        <code>useState</code> lives.
      </p>
      <CodeBlock
        filename="handlers as props, named onX / handleX"
        code={`
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)

  function handleToggle(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return todos.map((todo) => (
    <TodoRow key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
  ))
}

function TodoRow({ todo, onToggle }: { todo: Todo; onToggle: (id: string) => void }) {
  return <input checked={todo.done} onChange={() => onToggle(todo.id)} />
}
`}
      />
      <p>
        Notice the naming convention: the prop itself is named <code>onX</code> (what happened —{" "}
        <code>onToggle</code>, <code>onDelete</code>) while the function implementing it is named{" "}
        <code>handleX</code> (what to do about it — <code>handleToggle</code>,{" "}
        <code>handleDelete</code>). This isn&apos;t enforced by React, but it&apos;s a strong,
        widely-followed convention that makes call sites self-documenting.
      </p>
      <p>
        You&apos;ll notice inline arrow functions like <code>{"() => onToggle(todo.id)"}</code>{" "}
        directly in JSX above — that creates a brand-new function on every render. For this course
        (and for the vast majority of real components) that&apos;s completely fine; it only
        matters for a small, specific class of performance problems covered in the later{" "}
        <code>memo</code>/<code>useCallback</code> lesson.
      </p>
      <Demo title="click-to-toggle and delete, wired via onX props">
        <TodoList />
      </Demo>
      <VueComparison>
        JSX&apos;s <code>onClick={"{fn}"}</code> plays the same role as Vue&apos;s{" "}
        <code>@click=&quot;fn&quot;</code> — both attach a handler to a DOM event. The bigger
        difference is how a child communicates back to a parent: Vue components{" "}
        <code>emit(&apos;toggle&apos;, id)</code> a named custom event that the parent listens for
        with <code>@toggle=&quot;...&quot;</code>. React has no event-emitter layer between
        components — a &quot;child event&quot; is simply the parent passing down an ordinary
        function prop (<code>onToggle</code>) that the child calls directly. Same effect, no
        separate emit/listen API.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            <code>TodoRow</code> attaches <code>onClick</code> to the todo&apos;s{" "}
            <code>&lt;span&gt;</code> as well as <code>onChange</code> to the checkbox, both calling{" "}
            <code>onToggle(todo.id)</code>. Why is <code>onChange</code> the right event for the
            checkbox specifically, rather than also using <code>onClick</code> on it?
          </p>
        }
        solution={
          <p>
            For checkboxes, <code>onChange</code> fires whenever the checked state actually changes
            (including via keyboard, e.g. spacebar while focused), whereas relying on{" "}
            <code>onClick</code> would miss non-click ways of toggling it and can behave
            inconsistently with the &quot;controlled&quot; <code>checked</code> prop React expects
            to pair with <code>onChange</code>. The <code>&lt;span&gt;</code> isn&apos;t a form
            control, so <code>onClick</code> is the correct (only) choice there.
          </p>
        }
      />
    </Lesson>
  );
}
