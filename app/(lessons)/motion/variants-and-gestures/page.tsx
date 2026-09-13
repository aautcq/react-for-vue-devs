import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { GestureTodoList } from "./GestureTodoList";

export default function Page() {
  return (
    <Lesson track="motion" slug="variants-and-gestures" title="Variants & Gestures">
      <p>
        Every earlier lesson passed animation targets as literal objects:{" "}
        <code>animate={"{{ opacity: 1 }}"}</code>. That&apos;s fine for one element, but gets
        repetitive — and hard to coordinate — once a parent and several children all need to
        animate together (say, a list fading/staggering in, item by item). <strong>Variants</strong>{" "}
        solve this: instead of inline objects, you define named states once and reference them by
        string everywhere they&apos;re used.
      </p>
      <CodeBlock
        filename="naming states instead of repeating objects"
        code={`
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

<motion.li
  initial="hidden"   // look up itemVariants.hidden
  animate="visible"  // look up itemVariants.visible
  variants={itemVariants}
/>
`}
      />
      <p>
        The real payoff is <strong>propagation</strong>: if a parent <code>motion.*</code>{" "}
        element has its own <code>variants</code> and a named <code>animate</code> state, every{" "}
        <code>motion.*</code> child that <em>doesn&apos;t</em> specify its own{" "}
        <code>initial</code>/<code>animate</code> automatically inherits and follows the parent
        into the matching variant by name — no prop drilling required. Add{" "}
        <code>staggerChildren</code> to the parent variant&apos;s <code>transition</code>, and
        Motion delays each child&apos;s entrance by that amount relative to its sibling, turning a
        single state change into a staggered cascade.
      </p>
      <CodeBlock
        filename="a parent orchestrating its children"
        code={`
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

<motion.ul initial="hidden" animate="visible" variants={listVariants}>
  {todos.map((todo) => (
    <motion.li key={todo.id} variants={itemVariants} /* inherits "hidden"/"visible" */>
      {todo.text}
    </motion.li>
  ))}
</motion.ul>
`}
      />
      <p>
        Separately, Motion also ships a set of <strong>gesture shortcuts</strong> — props that
        apply a style object only while a particular interaction is active, with no event handlers
        or extra state to write: <code>whileHover</code>, <code>whileTap</code>,{" "}
        <code>whileFocus</code>, and <code>whileInView</code>. Each behaves like a temporary{" "}
        <code>animate</code> override that Motion automatically reverts once the interaction ends.
      </p>
      <CodeBlock
        filename="gesture shortcuts"
        code={`
<motion.li
  whileHover={{ scale: 1.02 }}  // while the pointer is over it
  whileTap={{ scale: 0.97 }}    // while pressed/held down
/>
`}
      />
      <Demo title="a staggered entrance (variants), plus hover/tap micro-interactions on each row">
        <GestureTodoList />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/motion/variants-and-gestures/GestureTodoList.tsx (excerpt)"
        code={`
const listVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }

<motion.ul initial="hidden" animate="visible" variants={listVariants}>
  {todos.map((todo) => (
    <motion.li
      key={todo.id}
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => toggleTodo(todo.id)}
    >
      {todo.text}
    </motion.li>
  ))}
</motion.ul>
`}
      />
      <VueComparison>
        Vue has no built-in equivalent to <code>whileHover</code>/<code>whileTap</code> — the
        usual approach is <code>@mouseenter</code>/<code>@mouseleave</code>/<code>@mousedown</code>{" "}
        handlers toggling a boolean in a <code>ref</code>, then binding a class or inline{" "}
        <code>:style</code> off that boolean (or reaching for a directive library). Motion bakes
        the common interaction states in as declarative props with automatic revert-on-release
        behavior, so there&apos;s no state variable to manage for &quot;is this currently
        hovered/pressed&quot; at all. Variants likewise have no single built-in Vue parallel —
        the closest analog is manually computing a shared <code>class</code>/<code>style</code>{" "}
        binding off one piece of parent state and letting CSS transitions handle each
        child, but that&apos;s hand-rolled coordination rather than a first-class propagation
        mechanism.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            In the demo, if a single <code>motion.li</code> set its own explicit{" "}
            <code>animate={"{{ opacity: 1 }}"}</code> (a literal object, not a variant name),
            instead of inheriting from the parent, what would happen to that item during the
            staggered entrance, and why?
          </p>
        }
        solution={
          <p>
            That item would pop in immediately at full opacity instead of joining the stagger.
            Variant propagation only happens when a child doesn&apos;t specify its own{" "}
            <code>animate</code> — an explicit literal <code>animate</code> value on a child
            always takes precedence over inheriting the parent&apos;s named state, so it opts that
            one element out of the parent&apos;s orchestration (staggering, shared transition
            timing) entirely.
          </p>
        }
      />
    </Lesson>
  );
}
