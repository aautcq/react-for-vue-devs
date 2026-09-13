import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { KeyComparisonDemo } from "./KeyComparisonDemo";

export default function Page() {
  return (
    <Lesson track="react" slug="lists-and-keys" title="Rendering Lists & Keys">
      <p>
        Rendering a list in React is nothing more than mapping an array to an array of JSX
        elements with <code>.map()</code> — there&apos;s no <code>v-for</code> directive, just
        JavaScript producing an array that JSX knows how to render.
      </p>
      <CodeBlock
        filename="the whole mechanism"
        code={`
<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
</ul>
`}
      />
      <p>
        The <code>key</code> prop is not optional in practice, and React will warn loudly in the
        console if it&apos;s missing. A key is a stable, unique identifier that tells React
        &quot;this element represents the same logical item across renders,&quot; so that when the
        list changes — an item is added, removed, or reordered — React can match up old and new
        elements by <em>identity</em> instead of by position, and correctly preserve (or discard)
        component state, DOM nodes, and focus for each item.
      </p>
      <p>
        Using the array <strong>index</strong> as the key seems to work at first, because index
        keys are stable as long as the list itself never changes order or length. The moment an
        item is inserted, removed, or reordered, every item after that point gets a &quot;new&quot;
        index, so React thinks the identities shifted — it will reuse the wrong DOM nodes and
        component state for the wrong items. The demo below makes this concrete:
      </p>
      <Demo title="index-as-key vs. id-as-key, with the same removal">
        <KeyComparisonDemo />
      </Demo>
      <CodeBlock
        filename="stable id vs. index"
        code={`
// ✅ stable across reorders/removals — identity travels with the todo
todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)

// ⚠️ only "stable" if the list never reorders or shrinks/grows from the middle
todos.map((todo, index) => <TodoItem key={index} todo={todo} />)
`}
      />
      <p>
        The rule of thumb: key by something that uniquely and durably identifies the{" "}
        <em>data</em> (a database id, a UUID generated at creation time), never by the item&apos;s
        current position in the array.
      </p>
      <VueComparison>
        Vue&apos;s <code>v-for</code> works without a <code>:key</code> too, but Vue&apos;s docs
        strongly recommend always providing one, for the same reason. The diffing algorithms
        differ in the details — Vue&apos;s compiler-driven reconciliation and React&apos;s
        reconciler both use keys to match old/new children — but the failure mode you should watch
        for is identical in both: forgetting the key (or keying by index on a reorderable list)
        leads to state/DOM getting silently attached to the wrong row.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            In the demo above, if instead of <em>removing</em> the first todo, the list only ever
            appended new todos to the <em>end</em> (never removing or reordering from the middle),
            would <code>key={"{index}"}</code> still cause bugs? Why or why not?
          </p>
        }
        solution={
          <p>
            No — if items are only ever appended at the end and never removed/reordered, every
            existing item keeps the same index across renders, so index-as-key happens to behave
            identically to a stable id in that specific case. It&apos;s still fragile: the moment
            someone later adds &quot;remove&quot; or &quot;reorder,&quot; the same code silently
            breaks. That&apos;s why the convention is to always key by stable identity rather than
            index, even when it currently &quot;works.&quot;
          </p>
        }
      />
    </Lesson>
  );
}
