import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { AnimatedTodoList } from "./AnimatedTodoList";

export default function Page() {
  return (
    <Lesson track="motion" slug="animatepresence-for-todos" title="AnimatePresence for Add & Remove">
      <p>
        The Lists &amp; Keys lesson established that removing a todo from state produces a new
        array without that item, and React reconciles the DOM accordingly — the{" "}
        <code>&lt;li&gt;</code> is simply gone. That&apos;s a problem for exit animations: by the
        time you&apos;d want to animate an item sliding away, React has already unmounted it.
        There&apos;s no DOM node left to animate — the element is deleted <em>before</em> any exit
        transition could run.
      </p>
      <p>
        <code>AnimatePresence</code> solves this by intercepting the unmount. It watches its
        direct <code>motion.*</code> children, and when one is removed from the tree, it keeps
        that DOM node mounted just long enough to play its <code>exit</code> animation — only
        once that finishes does <code>AnimatePresence</code> actually let React remove it.
      </p>
      <CodeBlock
        filename="the shape of it"
        code={`
import { motion, AnimatePresence } from "motion/react"

<AnimatePresence>
  {todos.map((todo) => (
    <motion.li
      key={todo.id}
      initial={{ opacity: 0, x: -20 }}  // entrance, on mount
      animate={{ opacity: 1, x: 0 }}    // resting state
      exit={{ opacity: 0, x: 40 }}      // plays *before* unmount
    >
      {todo.text}
    </motion.li>
  ))}
</AnimatePresence>
`}
      />
      <p>
        Every animated child still needs a stable <code>key</code> — that&apos;s how{" "}
        <code>AnimatePresence</code> tells &quot;this item was removed&quot; apart from &quot;this
        item&apos;s content changed.&quot; It diffs children by key exactly the way React&apos;s
        reconciler does; without a proper <code>key={"{todo.id}"}</code> (see Lists &amp; Keys),
        it can&apos;t reliably tell an add from a reorder from a removal, and the wrong item ends
        up animating.
      </p>
      <p>
        The demo below adds <code>initial={"{false}"}</code> on the <code>AnimatePresence</code>{" "}
        itself, a small but common detail: it suppresses every item&apos;s entrance animation on
        first render (so the list doesn&apos;t all fade in when the page loads), while leaving
        exit animations — and entrance animations for items added afterwards — fully working.
      </p>
      <Demo title="removing a todo plays a fade + slide-out exit before it leaves the DOM">
        <AnimatedTodoList />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/motion/animatepresence-for-todos/AnimatedTodoList.tsx (excerpt)"
        code={`
<AnimatePresence initial={false}>
  {todos.map((todo) => (
    <motion.li
      key={todo.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2 }}
    >
      {todo.text}
      <button onClick={() => removeTodo(todo.id)}>Remove</button>
    </motion.li>
  ))}
</AnimatePresence>
`}
      />
      <VueComparison>
        The closest built-in match is <code>&lt;TransitionGroup&gt;</code>, which similarly
        animates items entering/leaving a list by applying enter/leave CSS classes around the
        mount/unmount boundary. Conceptually it&apos;s the same problem being solved (don&apos;t
        let the DOM node vanish before its transition plays), but the mechanism differs: Vue
        delays the actual DOM removal using CSS transition end events on classes it toggles, while{" "}
        <code>AnimatePresence</code> delays React&apos;s commit of the removal until its own JS
        animation engine reports the <code>exit</code> animation is complete — no CSS classes
        involved at all.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            If you swapped <code>key={"{todo.id}"}</code> for <code>key={"{index}"}</code> in the
            demo above, and removed the <em>first</em> todo from the list, what would you expect{" "}
            <code>AnimatePresence</code> to get wrong?
          </p>
        }
        solution={
          <p>
            With index keys, removing the first item shifts every remaining item&apos;s key down
            by one. <code>AnimatePresence</code> (like React&apos;s reconciler) would see this as
            the <em>last</em> key disappearing and every other &quot;item&quot; simply changing
            its content in place — so the exit animation would incorrectly play on the last row
            instead of the row you actually removed, while the removed item&apos;s text would
            appear to just vanish without animating at all.
          </p>
        }
      />
    </Lesson>
  );
}
