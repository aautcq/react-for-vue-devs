import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoForm } from "./TodoForm";

export default function Page() {
  return (
    <Lesson track="react" slug="forms-and-controlled-inputs" title="Forms & Controlled Inputs">
      <p>
        A <strong>controlled input</strong> is one whose displayed value is fully derived from
        React state, not from the DOM&apos;s own internal input state. You give the element{" "}
        <code>value={"{state}"}</code> and an <code>onChange</code> that updates that state — the
        input never manages its own value independently; React is the single source of truth for
        what&apos;s on screen.
      </p>
      <CodeBlock
        filename="the controlled-input pattern"
        code={`
const [text, setText] = useState("")

<input
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
`}
      />
      <p>
        Every keystroke fires <code>onChange</code>, which updates state, which re-renders the
        input with that new value — a round trip that happens so fast it&apos;s invisible, but it
        means the input&apos;s displayed text is always exactly what state says it should be. This
        is what makes it trivial to validate, transform, or clear the field programmatically:
        just derive it from (or reset) the state.
      </p>
      <p>
        Submitting the form needs one more piece: browsers submit forms with a full page
        navigation by default, which would blow away the entire React app. <code>e.preventDefault()</code>{" "}
        inside the <code>onSubmit</code> handler stops that, letting you handle the submission
        entirely in JavaScript instead.
      </p>
      <CodeBlock
        filename="preventing the default navigation"
        code={`
function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const trimmed = text.trim()
  if (!trimmed) return
  setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, done: false }])
  setText("")
}

<form onSubmit={handleSubmit}>
  <input value={text} onChange={(e) => setText(e.target.value)} />
  <button type="submit">Add</button>
</form>
`}
      />
      <p>
        The Todo running example now has a real entry point: type into the controlled input below,
        submit the form, and the new todo is appended to state (with the input cleared back to{" "}
        <code>&quot;&quot;</code> afterward).
      </p>
      <Demo title="a controlled form adding new todos">
        <TodoForm />
      </Demo>
      <VueComparison>
        This is the manual, explicit version of what <code>v-model</code> does for you in one
        directive. <code>{'<input v-model="text" />'}</code> desugars to exactly the same pair
        React writes out by hand: <code>{':value="text"'}</code> plus{" "}
        <code>{'@input="text = $event.target.value"'}</code>. React has no built-in two-way
        binding sugar, so controlled inputs always spell out the <code>value</code>/
        <code>onChange</code> pair explicitly — more typing, but nothing hidden. Preventing the
        default form submission is the same concept as Vue&apos;s <code>@submit.prevent</code>{" "}
        modifier, just written as an explicit call instead of a modifier keyword.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            What would happen if the input kept <code>onChange={"{(e) => setText(e.target.value)}"}</code>{" "}
            but you removed the <code>value={"{text}"}</code> prop entirely (leaving it an
            uncontrolled input)? Would typing still update the <code>text</code> state shown below
            the form?
          </p>
        }
        solution={
          <p>
            Yes — <code>onChange</code> alone is enough to keep <code>text</code> state in sync,
            since the DOM still fires the event and <code>e.target.value</code> still reflects what
            was typed. What breaks is the other direction: without <code>value={"{text}"}</code>,
            the input becomes uncontrolled, so you lose the ability to have React programmatically
            set/clear the field (like <code>setText(&quot;&quot;)</code> after submit) — the DOM
            would keep showing whatever the user last typed even after state resets to{" "}
            <code>&quot;&quot;</code>.
          </p>
        }
      />
    </Lesson>
  );
}
