import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { initialTodos } from "@/lib/todo-app/types";
import { TodoItem } from "./TodoItem";

export default function Page() {
  return (
    <Lesson track="react" slug="components-and-props" title="Components & Props">
      <p>
        A React component is just a plain JavaScript function. There&apos;s no special class, no{" "}
        <code>defineComponent</code>, no <code>&lt;script setup&gt;</code> block — a function that
        returns JSX <em>is</em> a component, as long as its name starts with a capital letter (so
        JSX can tell it apart from a lowercase DOM tag like <code>div</code>).
      </p>
      <p>
        Everything a component receives from its caller arrives as a single argument: the{" "}
        <strong>props object</strong>. When you write <code>{"<TodoItem todo={t} />"}</code>, React
        calls <code>{"TodoItem({ todo: t })"}</code> — that&apos;s the entire mechanism. Props flow{" "}
        <strong>one way only</strong>, parent to child. A component cannot reach up and mutate the
        prop it was given; there&apos;s no built-in two-way binding like Vue&apos;s{" "}
        <code>v-model</code>. If a child needs to change something, the parent hands it a callback
        prop instead (covered in the events lesson).
      </p>
      <CodeBlock
        filename="props are just a destructured argument"
        code={`
type Props = { todo: Todo }

// These two are equivalent — props is one plain object:
function TodoItem({ todo }: Props) { /* ... */ }
function TodoItem(props: Props) {
  const { todo } = props
  /* ... */
}
`}
      />
      <p>
        This lesson introduces the <strong>Running Example</strong> used throughout the rest of the
        course: a small Todo app. Here&apos;s a presentational <code>TodoItem</code> component — it
        takes one <code>Todo</code> and renders its text plus a checkbox reflecting{" "}
        <code>done</code>. It has no state and no event handlers yet, so the checkbox is{" "}
        <code>readOnly</code>; interactivity arrives in the next lesson.
      </p>
      <CodeBlock
        filename="app/(lessons)/react/components-and-props/TodoItem.tsx"
        code={`
import type { Todo } from "@/lib/todo-app/types"

function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li>
      <input type="checkbox" checked={todo.done} readOnly />
      <span>{todo.text}</span>
    </li>
  )
}
`}
      />
      <p>
        A special prop worth calling out: <code>children</code>. Whatever you nest between a
        component&apos;s open and close tags — <code>{"<Card>this</Card>"}</code> — is passed in
        automatically as <code>props.children</code>. It&apos;s just another prop, not a separate
        template concept, which is how components compose without a dedicated slot syntax.
      </p>
      <Demo title="a static list of TodoItems, rendered from props alone">
        <ul className="space-y-2">
          {initialTodos.slice(0, 2).map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </Demo>
      <VueComparison>
        A function component here is the rough equivalent of a Vue SFC&apos;s{" "}
        <code>defineProps</code> — both declare what a component accepts from its parent. The
        bigger mindset shift is the lack of built-in two-way binding: Vue&apos;s{" "}
        <code>v-model</code> (and <code>defineModel</code>) let a child update a parent&apos;s
        state directly through a prop. React has no equivalent — props are always read-only from
        the child&apos;s side, and &quot;the child changes something&quot; always means &quot;the
        child calls a function the parent passed it.&quot; <code>children</code> maps closely to
        Vue&apos;s default <code>&lt;slot /&gt;</code>: both are just &quot;whatever content was
        nested inside the tag,&quot; though Vue also has named/scoped slots for finer control,
        which React expresses instead as ordinary props holding renderable values.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            The <code>TodoItem</code> above uses <code>readOnly</code> on the checkbox. What would
            happen — and what would React warn about in the console — if you removed{" "}
            <code>readOnly</code> but kept <code>checked=&#123;todo.done&#125;</code> and no{" "}
            <code>onChange</code>?
          </p>
        }
        solution={
          <p>
            React would warn that you provided a <code>checked</code> prop to a form field without
            an <code>onChange</code> handler, warning it will render a read-only field. Clicking the
            checkbox would visually do nothing, because nothing ever updates{" "}
            <code>todo.done</code> — there&apos;s no state and no handler to change it. This is
            exactly why <code>readOnly</code> is here: it&apos;s an honest way to say &quot;this
            input intentionally can&apos;t be changed yet&quot; until <code>useState</code> and an{" "}
            <code>onChange</code> handler are introduced.
          </p>
        }
      />
    </Lesson>
  );
}
